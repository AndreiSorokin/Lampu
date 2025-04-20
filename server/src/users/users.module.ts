import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseAuthGuard } from '../firebase/firebase-auth-guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => FirebaseModule)],
  providers: [UsersService, FirebaseAuthGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
