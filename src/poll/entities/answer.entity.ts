import { Column, Entity, ManyToOne } from 'typeorm';
import { Option } from './option.entity';
import { Poll } from './poll.entity';

@Entity()
export class Answer {
  @Column({ primary: true })
  memberId: string;

  @ManyToOne(() => Poll, (poll) => poll.answers, {
    eager: false,
    primary: true,
  })
  poll: Poll;

  @ManyToOne(() => Option, (option) => option.answers, { eager: false })
  option: Option;
}
