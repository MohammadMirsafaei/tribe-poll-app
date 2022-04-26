import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Poll } from './poll.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Poll, (poll) => poll.options, { eager: false })
  poll: Poll;
}
