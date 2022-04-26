import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { CreatePollInput } from '../inputs/create-poll.input';

@EntityRepository(Poll)
export class PollRepository extends Repository<Poll> {
  async createPoll(user: User, data: CreatePollInput): Promise<Poll> {
    const poll = this.create({
      ...data,
      created_at: new Date(),
      user: user,
    });
    return this.save(poll);
  }
}
