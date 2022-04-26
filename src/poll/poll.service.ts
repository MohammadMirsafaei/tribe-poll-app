import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreatePollInput } from './inputs/create-poll.input';
import { PollRepository } from './repositories/poll.repository';
import { PollType } from './types/poll.type';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollRepository) private pollRepository: PollRepository,
  ) { };
  async createPoll(user: User, data: CreatePollInput): Promise<PollType> {
    return null;
  }
}
