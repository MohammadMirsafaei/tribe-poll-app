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

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  end: Date;

  @Field()
  @IsString()
  spaceId: string;

  @Field(() => [OptionInput])
  @IsArray()
  options: OptionInput[];
}
