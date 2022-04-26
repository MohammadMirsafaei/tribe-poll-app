import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './option.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamptz', nullable: true })
  end: Date;

  @Column('timestamptz')
  created_at: Date;

  @Column()
  spaceId: string;

  @ManyToOne(() => User, (user) => user.polls, { eager: false })
  user: User;

  @OneToMany(() => Option, (option) => option.poll, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  options: Option[];
}
