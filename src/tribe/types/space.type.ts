import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Space')
export class SpaceType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
