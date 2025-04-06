import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  telegram?: string;

  @ManyToMany(() => Event, (event) => event.enrolledUsers, { cascade: true })
  @JoinTable()
  cart!: Event[];

  @Column({ type: 'varchar', nullable: true })
  resetToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiration!: Date | null;
}
