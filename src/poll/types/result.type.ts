import { Field, ObjectType } from '@nestjs/graphql';
import { OptionType } from './option.type';

@ObjectType('Result')
export class ResultType {
  @Field(() => OptionType)
  option: OptionType;

  @Field()
  value: number;
}
