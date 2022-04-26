import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGuard } from 'src/auth/guards/gqp.guard';
import { PollService } from './poll.service';
import { PollType } from './types/poll.type';

@Resolver()
@UseGuards(GqlGuard)
export class PollResolver {
  constructor(private pollService: PollService) { }

  @Query(() => [PollType])
  async polls(): Promise<PollType[]> {
    return [];
  }

  @Mutation(() => PollType)
  async createPoll(): Promise<PollType> {
    return null;
  }
}
