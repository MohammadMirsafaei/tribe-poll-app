import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { OptionInput } from './option.input';

@InputType()
export class CreatePollInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsDate()
  @IsOptional()
  end: Date;

  @Field(() => [OptionInput])
  @IsArray()
  options: OptionInput[];
}
