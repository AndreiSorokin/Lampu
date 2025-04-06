import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
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
  capacity!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
