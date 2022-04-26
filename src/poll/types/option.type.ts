import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PollType } from './poll.type';

@ObjectType('Option')
export class OptionType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => PollType)
  poll: PollType;
}
