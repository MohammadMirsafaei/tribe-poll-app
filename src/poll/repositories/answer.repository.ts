import { EntityRepository, Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';
import { Option } from '../entities/option.entity';
import { Poll } from '../entities/poll.entity';

@EntityRepository(Answer)
export class AnswerRepository extends Repository<Answer> {
  async createAnswer(
    poll: Poll,
    option: Option,
    memberId: string,
  ): Promise<Answer> {
    const answer = this.create({ poll, option, memberId });
    return this.save(answer);
  }
}
