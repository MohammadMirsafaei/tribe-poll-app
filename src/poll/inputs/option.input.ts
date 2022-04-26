import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class OptionInput {
  @Field()
  @IsString()
  title: string;
}
