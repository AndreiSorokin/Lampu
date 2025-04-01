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

import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './event.dto';
import { UpdateEventDto } from './update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger: Logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async gitSingleEvent(id: number): Promise<Event | null> {
    return this.eventsRepository.findOneBy({ id });
  }

  async updateEvent(
    id: number,
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

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(createEventDto.date);

      if (eventDate < today) {
        throw new BadRequestException('Event date cannot be in the past');
      }

      const event = this.eventsRepository.create(createEventDto);
      return await this.eventsRepository.save(event);
    } catch {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async addToCart(userId: number, eventId: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['cart'],
      });
      const event = await this.eventsRepository.findOne({
        where: { id: eventId },
        relations: ['enrolledUsers'],
      });

      if (!user || !event) {
        throw new BadRequestException('User or Event not found');
      }
      if (event.enrolledUsers.length >= event.capacity) {
        throw new BadRequestException('Event is at full capacity');
      }
      if (event.target && event.target !== user.role) {
        throw new BadRequestException(
          `This event is restricted to ${event.target} users`,
        );
      }

      user.cart = user.cart || [];
      if (!user.cart.some((e) => e.id === eventId)) {
        user.cart.push(event);
      }
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          'Failed to update cart due to database error',
        );
      }
      throw new InternalServerErrorException('Failed to add event to cart');
    }
  }

  async getCart(userId: number): Promise<Event[]> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['cart'],
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user.cart || [];
    } catch (error: any) {
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
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const expiredEvents = await this.eventsRepository.find({
        where: { date: LessThan(today) },
      });

      if (expiredEvents.length > 0) {
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
  handleExpiredEvents() {
    this.deleteExpiredEvents();
  }
}
