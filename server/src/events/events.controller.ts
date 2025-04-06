import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from '../dtos/event/event.dto';
import { UpdateEventDto } from '../dtos/event/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { UserResponseDto } from '../dtos/user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post(':eventId/add-to-cart')
  @UseGuards(AuthGuard('jwt'))
  async addToCart(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    return await this.eventsService.addToCart(user, eventId);
  }

  @Delete(':eventId/remove-from-cart')
  @UseGuards(AuthGuard('jwt'))
  async removeFromCart(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    return await this.eventsService.removeFromCart(user, eventId);
  }

  @Get('cart')
  @UseGuards(AuthGuard('jwt'))
  async getCart(@CurrentUser() user: User): Promise<Event[]> {
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
  async getSingleEvent(@Param('id') id: string): Promise<Event | null> {
    return await this.eventsService.getSingleEvent(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Event> {
    return this.eventsService.createEvent(createEventDto, file);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, updateEventDto);
  }
}
