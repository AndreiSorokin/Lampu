import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = this.eventsRepository.create(createEventDto);
      return await this.eventsRepository.save(event);
    } catch (error) {
      console.log('Error: ', error)
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new BadRequestException('Email already exists');
        }
      }
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
}
