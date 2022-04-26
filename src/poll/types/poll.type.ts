import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OptionType } from './option.type';

@ObjectType('Poll')
export class PollType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  end: Date;

  @Field()
  created_at: Date;

  @Field(() => [OptionType])
  options: OptionType[];
}
