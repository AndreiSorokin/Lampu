/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { CreateUserDto } from '../dtos/user/user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async findByFirebaseUid(uid: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { firebaseUid: uid } });
  }

  async createFromFirebase(decoded: any): Promise<User> {
    const newUser = this.usersRepository.create({
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: decoded.name || '',
    });

    return await this.usersRepository.save(newUser);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const token = uuid.v4();
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1);

      user.resetToken = token;
      user.resetTokenExpiration = tokenExpiration;
      await this.usersRepository.save(user);

      const appDeepLink = `myapp://reset-password?token=${token}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Use this token in the app: ${token}\n\nAlternatively, open this link: ${appDeepLink}\n\nThis token expires in 1 hour.`,
      });

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to recover password');
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { resetToken: token },
      });

      if (
        !user ||
        !user.resetTokenExpiration ||
        user.resetTokenExpiration < new Date()
      ) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await this.usersRepository.save(user);

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async toggleMember(id: string, role: UserRole) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (![UserRole.USER, UserRole.MEMBERS].includes(role)) {
        throw new BadRequestException('Invalid role update');
      }

      user.role = role;

      if (user.role === UserRole.ADMIN || role === UserRole.ADMIN) {
        throw new UnauthorizedException('Changing admin roles is not allowed');
      }
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to toggle role');
    }
  }

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

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['cart'],
      select: ['id', 'email', 'password', 'role', 'name'],
    });
    return user;
  }
}
