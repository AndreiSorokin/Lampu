import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from './event.dto';
import { UpdateEventDto } from './update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post(':eventId/add-to-cart')
  @UseGuards(AuthGuard('jwt'))
  async addToCart(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.eventsService.addToCart(user, eventId);
  }

  @Get('cart')
  @UseGuards(AuthGuard('jwt'))
  async getCart(@CurrentUser() user: User): Promise<Event[]> {
    console.log('User in controller:', user);
    return this.eventsService.getCart(user);
  }

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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Event | null> {
    return await this.eventsService.getSingleEvent(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  // @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Event> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const imageBuffer: Buffer | undefined = file ? file.buffer : undefined;
    return this.eventsService.createEvent(createEventDto, imageBuffer);
  }

  @Put(':id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, updateEventDto);
  }
}
