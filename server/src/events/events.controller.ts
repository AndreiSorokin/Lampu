import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './event.dto';
import { UpdateEventDto } from './update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents(): Promise<Event[] | { message: string }> {
    const events = await this.eventsService.getAllEvents();
    if (events.length === 0) {
      return { message: 'No events found' };
    }
    return events;
  }

  @Get(':id')
  async getSingleEvent(
    @Param('id') id: string,
  ): Promise<Event | { message: string }> {
    const event = await this.eventsService.getSingleEvent(+id);
    if (!event) {
      return { message: 'Event not found' };
    }
    return event;
  }

  @Put(':id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Event> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const imageBuffer: Buffer | undefined = file ? file.buffer : undefined;
    return this.eventsService.createEvent(createEventDto, imageBuffer);
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
