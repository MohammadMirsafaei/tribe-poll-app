import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GqlGuard } from 'src/auth/guards/gqp.guard';
import { AnswerInput } from './inputs/answer.input';
import { CreatePollInput } from './inputs/create-poll.input';
import { PollService } from './poll.service';
import { AnswerType } from './types/answer.type';
import { PollWithResultType } from './types/poll-with-result.type';
import { PollType } from './types/poll.type';

@Resolver()
export class PollResolver {
  constructor(private pollService: PollService) { }

  @Query(() => [PollType])
  @UseGuards(GqlGuard)
  async polls(@GetUser() user: User): Promise<PollType[]> {
    return this.pollService.getPolls(user);
  }

  @Query(() => PollWithResultType)
  @UseGuards(GqlGuard)
  async getPoll(
    @GetUser() user: User,
    @Args('pollId') pollId: string,
  ): Promise<PollWithResultType> {
    return this.pollService.getPoll(user, pollId);
  }

  @Mutation(() => PollType)
  @UseGuards(GqlGuard)
  async createPoll(
    @GetUser() user: User,
    @Args('data') data: CreatePollInput,
  ): Promise<PollType> {
    return this.pollService.createPoll(user, data);
  }


  @Mutation(() => AnswerType)
  async answer(@Args('data') data: AnswerInput): Promise<AnswerType> {
    return this.pollService.answer(data);
  }
}
