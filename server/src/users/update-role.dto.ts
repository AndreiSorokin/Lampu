import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from './user-role.enum';

export class UpdateRoleDto {
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole value' })
  @IsNotEmpty({ message: 'User role is required' })
  role!: UserRole;
}
