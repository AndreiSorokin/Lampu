import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updatePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    try {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      console.log('Password comparison result:', isPasswordValid);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || UserRole.USER,
        cart: [],
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new BadRequestException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['cart'],
      select: ['id', 'email', 'password', 'role', 'name'],
    });
    console.log('User found in findOne:', user); 
    return user;
  }
}
