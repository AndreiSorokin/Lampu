import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth-guard';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../users/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getEnrollments() {
    return this.enrollmentsService.getEnrollments();
  }

  @Patch(':id/attended')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAttendance(
    @Param('id') id: string,
    @Body('attended') attended: boolean,
  ) {
    return this.enrollmentsService.updateAttendance(id, attended);
  }
}
