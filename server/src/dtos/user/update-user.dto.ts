import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  Validate,
} from 'class-validator';
import { IsPastDateConstraint } from '../../users/validators/is-past-date.validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in YYYY-MM-DD format',
  })
  @Validate(IsPastDateConstraint)
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  telegram?: string;
}
