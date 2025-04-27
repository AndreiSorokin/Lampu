import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async getEnrollments(): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsRepository.find();
      if (!enrollments) {
        throw new NotFoundException('Enrollments not found');
      }
      return enrollments;
    } catch {
      throw new NotFoundException('Failed to fetch enrollments');
    }
  }

  async updateAttendance(id: string, attended: boolean): Promise<Enrollment> {
    try {
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }

      enrollment.attended = attended;
      return this.enrollmentsRepository.save(enrollment);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new BadRequestException('Enrollment already exists');
        }
      }
      throw new InternalServerErrorException('Failed to update enrollment');
    }
  }
}
