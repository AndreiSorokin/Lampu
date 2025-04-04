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

import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './event.dto';
import { UpdateEventDto } from './update-event.dto';
import { UserResponseDto } from '../users/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);
  private readonly s3Client: S3Client;

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async getSingleEvent(id: string): Promise<Event | null> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
        relations: ['enrolledUsers'],
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
  ): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      Object.assign(event, updateEventDto);
      return await this.eventsRepository.save(event);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new BadRequestException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createEvent(
    createEventDto: CreateEventDto,
    imageBuffer?: Buffer,
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

      if (imageBuffer) {
        const key = `events/${savedEvent.id}/image.jpg`;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/jpeg',
          }),
        );
        savedEvent.imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        await this.eventsRepository.save(savedEvent);
      }
      return savedEvent;
    } catch {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async bookEvent(user: User, eventId: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
        relations: ['enrolledUsers'],
      });

      if (!user || !event) {
        throw new BadRequestException('User or Event not found');
      }

      console.log('User attempting to enroll: ', user.id);
      console.log(
        'Enrolled Users before: ',
        event.enrolledUsers?.map((u) => u.id) || [],
      );

      const currentEnrollment = event.enrolledUsers
        ? event.enrolledUsers.length
        : 0;
      console.log(
        'Current Enrollment: ',
        currentEnrollment,
        ' Capacity: ',
        event.capacity,
      );

      if (currentEnrollment >= event.capacity) {
        console.log('Rejecting due to full capacity');
        throw new BadRequestException('Event is at full capacity');
      }

      if (event.target && event.target !== user.role) {
        throw new BadRequestException(
          `This event is restricted to ${event.target} users`,
        );
      }

      event.enrolledUsers = event.enrolledUsers || [];
      if (!event.enrolledUsers.some((u) => u.id === user.id)) {
        event.enrolledUsers.push(user);
        console.log(
          'Enrolled Users after adding: ',
          event.enrolledUsers.map((u) => u.id),
        );
      } else {
        console.log('User already enrolled, skipping addition');
      }

      const savedEvent = await this.eventsRepository.save(event);
      console.log(
        'Enrolled Users after save: ',
        savedEvent.enrolledUsers.map((u) => u.id),
      );

      return savedEvent;
    } catch (error) {
      console.log('Error in bookEvent: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to book event');
    }
  }
  async addToCart(user: User, eventId: string): Promise<UserResponseDto> {
    try {
      console.log(
        'Starting addToCart for user: ',
        user.id,
        ' event: ',
        eventId,
      );
      const event = await this.bookEvent(user, eventId);

      user.cart = user.cart || [];
      if (!user.cart.some((e) => e.id === eventId)) {
        user.cart.push(event);
      }

      const savedUser = await this.usersRepository.save(user);
      console.log(
        'User cart after save: ',
        savedUser.cart.map((e) => e.id),
      );

      return plainToClass(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log('Error in addToCart: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add event to cart');
    }
  }

  async removeFromCart(user: User, eventId: string): Promise<UserResponseDto> {
    try {
      const freshUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['cart'],
      });
      if (!freshUser) {
        throw new BadRequestException('User not found');
      }

      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
        relations: ['enrolledUsers'],
      });
      if (!event) {
        throw new BadRequestException('Event not found');
      }

      event.enrolledUsers =
        event.enrolledUsers?.filter((u) => u.id !== user.id) || [];
      console.log(
        'Enrolled Users after removal: ',
        event.enrolledUsers.map((u) => u.id),
      );
      await this.eventsRepository.save(event);

      freshUser.cart = freshUser.cart?.filter((e) => e.id !== eventId) || [];
      const savedUser = await this.usersRepository.save(freshUser);

      return plainToClass(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log('Error in removeFromCart: ', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to remove event from cart',
      );
    }
  }

  async getCart(user: User): Promise<Event[]> {
    try {
      const freshUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['cart'],
      });
      if (!freshUser) {
        throw new BadRequestException('User not found');
      }
      return freshUser.cart || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve cart');
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
