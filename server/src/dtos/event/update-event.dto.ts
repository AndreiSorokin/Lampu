import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../users/user-role.enum';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsOptional()
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(UserRole, { message: 'Target must be a valid UserRole value' })
  @IsOptional()
  target?: UserRole;

  @IsNumber({}, { message: 'Capacity must be a number' })
  @IsOptional()
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
