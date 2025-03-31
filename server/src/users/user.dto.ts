// src/users/user.dto.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEnum,
  IsOptional,
  Validate,
} from 'class-validator';
import { UserRole } from './user.entity';
import { IsPastDateConstraint } from './validators/is-past-date.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email must match a valid format',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain lowercase and uppercase letters and numbers',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in YYYY-MM-DD format',
  })
  @Validate(IsPastDateConstraint)
  dateOfBirth!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsEnum(UserRole, { message: 'Role must be a valid UserRole value' })
  @IsOptional()
  role?: UserRole;
}
