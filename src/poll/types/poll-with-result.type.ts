import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PollType } from './poll.type';
import { ResultType } from './result.type';

@ObjectType('PollWithResult')
export class PollWithResultType extends PollType {
  @Field(() => [ResultType])
  results: ResultType[];
}
