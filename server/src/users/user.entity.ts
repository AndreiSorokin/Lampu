import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { UserRole } from './user-role.enum';
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'firebase_uid', unique: true })
  firebaseUid!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  telegram?: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments!: Enrollment[];

  @ManyToMany(() => Event, (event) => event.likedByUsers, { cascade: true })
  @JoinTable()
  likes!: Event[];

  @Column({ type: 'varchar', nullable: true })
  resetToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiration!: Date | null;
}
