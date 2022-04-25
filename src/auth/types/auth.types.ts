import { Field, ObjectType } from '@nestjs/graphql';
import { TokenType } from './token.types';
import { UserType } from './user.type';

@ObjectType('Auth')
export class AuthType extends TokenType {
  @Field()
  user: UserType;
}
