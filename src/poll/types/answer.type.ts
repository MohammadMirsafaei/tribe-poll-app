import { Field, ObjectType } from '@nestjs/graphql';
import { OptionType } from './option.type';
import { PollType } from './poll.type';

@ObjectType('Answer')
export class AnswerType {
  @Field(() => OptionType)
  option: OptionType;

  @Field(() => PollType)
  poll: PollType;
}
