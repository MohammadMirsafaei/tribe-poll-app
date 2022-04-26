import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GqlGuard } from 'src/auth/guards/gqp.guard';
import { CreatePollInput } from './inputs/create-poll.input';
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
  async createPoll(
    @GetUser() user: User,
    @Args('data') data: CreatePollInput,
  ): Promise<PollType> {
    return this.pollService.createPoll(user, data);
  }
}
