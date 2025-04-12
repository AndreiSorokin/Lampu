/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/user/user.dto';
import { CurrentUser } from './current-user.decorator';
import { UpdatePasswordDto } from '../dtos/user/update-password.dto';
import { UserRole } from './user-role.enum';
import { Roles } from './roles.decorator';
import { UpdateRoleDto } from '../dtos/user/update-role.dto';
import { ForgotPasswordDto } from '../dtos/user/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/user/reset-password.dto';
import { FirebaseAuthGuard } from '../firebase/firebase-auth-guard';
import * as admin from 'firebase-admin';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Post('toggle-member/:id')
  @UseGuards(FirebaseAuthGuard)
  @Roles(UserRole.ADMIN)
  async toggleMember(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.usersService.toggleMember(id, updateRoleDto.role);
  }

  @Post('update-password')
  @UseGuards(FirebaseAuthGuard)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const fullUser = await this.usersService.findOne(user.id);
      if (!fullUser) {
        throw new NotFoundException('User not found');
      }
      return await this.usersService.updatePassword(
        fullUser,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword,
      );
    } catch {
      throw new InternalServerErrorException('Failed to update password');
    }
  }
  @Post()
  @HttpCode(201)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (decodedToken.uid !== createUserDto.firebaseUid) {
        throw new UnauthorizedException('Invalid token: UID mismatch');
      }

      if (decodedToken.email !== createUserDto.email) {
        throw new UnauthorizedException('Email mismatch');
      }

      return this.usersService.createUser(createUserDto);
    } catch {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  @Get()
  async findAll(): Promise<User[] | { message: string }> {
    const users = await this.usersService.findAll();
    if (users.length === 0) {
      return { message: 'No users found' };
    }
    return users;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<User | null | { message: string }> {
    const user = await this.usersService.findOne(id);
    if (user === null) {
      return { message: 'User not found' };
    }
    return user;
  }
}
