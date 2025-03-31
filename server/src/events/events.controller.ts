import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async 

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.createEvent(createEventDto);
  }

  @Post('cart/add')
  async addToCart(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('eventId', ParseIntPipe) eventId: number,
  ): Promise<Event[]> {
    const user = await this.eventsService.addToCart(userId, eventId);
    return user.cart;
  }

  @Get('cart/:userId')
  async getCart(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventsService.getCart(userId);
  }
}
