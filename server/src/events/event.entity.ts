import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { Enrollment } from '../enrollments/enrollment.entity';
@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  target?: UserRole;

  @Column()
  capacity!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.event)
  enrollments!: Enrollment[];

  @ManyToMany(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  likedByUsers!: User[];
}
