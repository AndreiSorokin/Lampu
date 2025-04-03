import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';
import { UpdatePasswordDto } from './update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('update-password')
  @UseGuards(AuthGuard('jwt'))
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
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
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
    const user = await this.usersService.findOne(+id);
    if (user === null) {
      return { message: 'User not found' };
    }
    return user;
  }
}
