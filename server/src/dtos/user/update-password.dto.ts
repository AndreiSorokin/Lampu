import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  oldPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword!: string;
}
