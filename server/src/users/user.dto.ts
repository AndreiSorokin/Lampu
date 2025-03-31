// src/users/user.dto.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsString()
  name?: string;
}
