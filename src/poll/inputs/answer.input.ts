import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class AnswerInput {
  @Field()
  @IsUUID()
  optionId: string;

  @Field()
  @IsUUID()
  pollId: string;

  @Field()
  @IsString()
  memberId: string;
}
