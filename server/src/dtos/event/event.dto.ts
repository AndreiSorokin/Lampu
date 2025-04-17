/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';
import { UserRole } from '../../users/user-role.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date!: Date;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price!: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(UserRole, { message: 'Target must be a valid UserRole value' })
  @IsOptional()
  target?: UserRole;

  @IsNumber({}, { message: 'Capacity must be a number' })
  @IsNotEmpty({ message: 'Capacity is required' })
  @Min(1, { message: 'Capacity must be at least 1' })
  @Type(() => Number)
  capacity!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class EventResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  date!: Date;

  @Expose()
  capacity!: number;

  @Expose()
  @Transform(({ obj }) => {
    return (
      obj.enrollments?.map((enrollment: any) => ({
        userId: enrollment.user?.id,
        userName: enrollment.user?.name,
        attended: enrollment.attended,
      })) || []
    );
  })
  enrollments!: { userId: string; userName: string; attended: boolean }[];
}
