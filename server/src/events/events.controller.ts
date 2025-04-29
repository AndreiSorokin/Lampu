/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  Request,
  Patch,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { CreateEventDto } from '../dtos/event/event.dto';
import { UpdateEventDto } from '../dtos/event/update-event.dto';
import { CurrentUser } from '../users/current-user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { UserResponseDto } from '../dtos/user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../firebase/firebase-auth-guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/favorites')
  @UseGuards(FirebaseAuthGuard)
  async getFavorites(@Request() req) {
    return await this.eventsService.getLikedEvents(req.user.id);
  }

  @Patch(':eventId/like')
  @UseGuards(FirebaseAuthGuard)
  async likeEvent(@Param('eventId') eventId: string, @Request() req) {
    await this.eventsService.likeEvent(req.user.id, eventId);
    return { message: 'Event liked' };
  }

  @Patch(':eventId/unlike')
  @UseGuards(FirebaseAuthGuard)
  async unlikeEvent(@Param('eventId') eventId: string, @Request() req) {
    await this.eventsService.unlikeEvent(req.user.id, eventId);
    return { message: 'Event unliked' };
  }

  @Post(':eventId/enroll')
  @UseGuards(FirebaseAuthGuard)
  async enrollInEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.addToEnrollments(user, eventId);
  }

  @Delete(':eventId')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ): Promise<void> {
    await this.eventsService.deleteEvent(eventId);
  }

  @Delete(':eventId/remove-from-enrollments')
  @UseGuards(FirebaseAuthGuard)
  async removeFromEnrollments(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @CurrentUser() user: User,
  ): Promise<UserResponseDto> {
    return await this.eventsService.removeFromEnrollments(user, eventId);
  }

  @Get('enrollments')
  @UseGuards(FirebaseAuthGuard)
  async getEnrollments(@CurrentUser() user: User): Promise<Event[]> {
    return this.eventsService.getEnrollments(user);
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
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Event> {
    return this.eventsService.createEvent(createEventDto, file);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Event> {
    console.log(updateEventDto);
    return this.eventsService.updateEvent(id, updateEventDto, file);
  }
}
