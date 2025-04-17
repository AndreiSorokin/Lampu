import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { FirebaseAuthGuard } from '../firebase/firebase-auth-guard';
import { FirebaseModule } from '../firebase/firebase.module';
import { EnrollmentsModule } from '../enrollments/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User]),
    EnrollmentsModule,
    FirebaseModule,
  ],
  providers: [EventsService, FirebaseAuthGuard],
  controllers: [EventsController],
})
export class EventsModule {}
