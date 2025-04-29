/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as path from 'path';

import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from '../dtos/event/event.dto';
import { UpdateEventDto } from '../dtos/event/update-event.dto';
import { UserResponseDto } from '../dtos/user/user.dto';
import { plainToClass } from 'class-transformer';
import { Enrollment } from '../enrollments/enrollment.entity';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);
  private readonly s3Client: S3Client;

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS credentials or region not configured in environment variables',
      );
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getLikedEvents(userId: string): Promise<Event[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likes'],
    });
  
    return user?.likes || [];
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const events = await this.eventsRepository.find();
      if (!events) {
        throw new NotFoundException('Events not found');
      }
      return events;
    } catch {
      throw new NotFoundException('Failed to fetch events');
    }
  }

  async getSingleEvent(id: string): Promise<Event | null> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
        relations: ['likedByUsers', 'enrollments'],
      });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve event');
    }
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      Object.assign(event, updateEventDto);
      const savedEvent = await this.eventsRepository.save(event);

      if (file) {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const key = `events/${savedEvent.id}/image${fileExtension}`;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        savedEvent.imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        await this.eventsRepository.save(savedEvent);
      } else if (updateEventDto.imageUrl) {
        savedEvent.imageUrl = updateEventDto.imageUrl;
        await this.eventsRepository.save(savedEvent);
      }

      return savedEvent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new BadRequestException('Event already exists');
        }
      }
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async createEvent(
    createEventDto: CreateEventDto,
    file?: Express.Multer.File,
  ): Promise<Event> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(createEventDto.date);

      if (eventDate < today) {
        throw new BadRequestException('Event date cannot be in the past');
      }

      const event = this.eventsRepository.create(createEventDto);
      const savedEvent = await this.eventsRepository.save(event);

      if (file) {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const key = `events/${savedEvent.id}/image${fileExtension}`;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        savedEvent.imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        await this.eventsRepository.save(savedEvent);
      } else if (createEventDto.imageUrl) {
        savedEvent.imageUrl = createEventDto.imageUrl;
        await this.eventsRepository.save(savedEvent);
      }
      return savedEvent;
    } catch {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const event = await this.eventsRepository.findOneBy({ id: eventId });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.imageUrl) {
        const urlParts = event.imageUrl.split('/');
        const key = urlParts.slice(3).join('/');

        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
          }),
        );
      }
      await this.eventsRepository.delete({ id: eventId });
    } catch {
      throw new InternalServerErrorException('Failed to delete events');
    }
  }

  async likeEvent(userId: string, eventId: string): Promise<void> {
    try {
      const event = await this.eventsRepository.findOneBy({ id: eventId });
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['likes'],
      });

      if (!user || !event) {
        throw new NotFoundException('User or Event not found');
      }

      const alreadyLiked = user.likes.find((e) => e.id === event.id);
      if (alreadyLiked) {
        throw new BadRequestException('Event is already liked');
      }
      user.likes.push(event);
      await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to like event');
    }
  }

  async unlikeEvent(userId: string, eventId: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['likes'],
      });
    
      if (!user) throw new NotFoundException('User not found');
    
      user.likes = user.likes.filter((e) => e.id !== eventId);
      await this.usersRepository.save(user);
    } catch {
      throw new InternalServerErrorException('Failed to unlike event');
    }
  }

  async addToEnrollments(user: User, eventId: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
        relations: ['enrollments', 'enrollments.user'],
      });

      if (!user || !event) {
        throw new BadRequestException('User or Event not found');
      }

      const currentEnrollment = event.enrollments.length;

      if (currentEnrollment >= event.capacity) {
        throw new BadRequestException('Event is at full capacity');
      }

      if (event.target && event.target !== user.role) {
        throw new BadRequestException(
          `This event is restricted to ${event.target} users`,
        );
      }

      const alreadyEnrolled = event.enrollments.some(
        (enrollment) => enrollment.user.id === user.id,
      );

      if (alreadyEnrolled) {
        return event;
      }

      const enrollment = this.enrollmentRepository.create({
        user,
        event,
        attended: false,
      });

      await this.enrollmentRepository.save(enrollment);

      return event;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to book event');
    }
  }
  async removeFromEnrollments(
    user: User,
    eventId: string,
  ): Promise<UserResponseDto> {
    try {
      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          user: { id: user.id },
          event: { id: eventId },
        },
        relations: ['user', 'event'],
      });

      if (!enrollment) {
        throw new BadRequestException('Enrollment not found');
      }

      await this.enrollmentRepository.remove(enrollment);

      const freshUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['enrollments', 'enrollments.event', 'likes'],
      });

      return plainToClass(UserResponseDto, freshUser!, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to remove enrollment');
    }
  }

  async getEnrollments(user: User): Promise<Event[]> {
    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { user: { id: user.id }, attended: false },
        relations: ['event'],
      });

      return enrollments.map((e) => e.event);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve enrollments');
    }
  }

  async deleteExpiredEvents(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiredEvents = await this.eventsRepository.find({
        where: { date: LessThan(today) },
      });

      if (expiredEvents.length > 0) {
        for (const event of expiredEvents) {
          if (event.imageUrl) {
            const key = `events/${event.id}/image.jpg`;
            await this.s3Client.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
              }),
            );
          }
        }
        await this.eventsRepository.remove(expiredEvents);
        this.logger.log(`Deleted ${expiredEvents.length} expired events`);
      } else {
        this.logger.log('No expired events found');
      }
    } catch {
      this.logger.error('Failed to delete expired events');
      throw new InternalServerErrorException('Failed to delete expired events');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredEvents() {
    try {
      await this.deleteExpiredEvents();
      this.logger.log('Successfully handled expired events');
    } catch {
      this.logger.error('Error in handleExpiredEvents');
    }
  }
}
