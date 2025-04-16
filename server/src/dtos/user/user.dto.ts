/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEnum,
  IsOptional,
  Validate,
} from 'class-validator';
import { UserRole } from '../../users/user-role.enum';
import { IsPastDateConstraint } from '../../users/validators/is-past-date.validator';
import { Exclude, Expose, Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  firebaseUid!: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Email must match a valid format',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain lowercase and uppercase letters and numbers',
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

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: UserRole;

  @Expose()
  name?: string;

  @Expose()
  dateOfBirth!: string;

  @Expose()
  instagram?: string;

  @Expose()
  telegram?: string;

  @Expose()
  @Transform(({ value }) =>
    value.map((event: any) => ({ id: event.id, name: event.name })),
  )
  cart!: { id: string; name: string }[];

  @Expose()
  @Transform(({ value }) =>
    value.map((event: any) => ({ id: event.id, name: event.name })),
  )
  likes!: { id: string; name: string }[];

  @Exclude()
  password!: string;
}
