import { EntityRepository, Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';

@EntityRepository(Poll)
export class PollRepository extends Repository<Poll> { }
