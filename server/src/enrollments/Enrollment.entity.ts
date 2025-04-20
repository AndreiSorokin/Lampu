/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.enrollments)
  user!: User;

  @ManyToOne(() => Event, (event) => event.enrollments)
  event!: Event;

  @Column({ default: false })
  attended!: boolean;
}
