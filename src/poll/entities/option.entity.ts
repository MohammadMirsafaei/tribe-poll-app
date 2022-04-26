import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { Poll } from './poll.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Poll, (poll) => poll.options, { eager: false })
  poll: Poll;

  @OneToMany(() => Answer, (answer) => answer.option, { eager: true })
  answers: Answer[];
}
