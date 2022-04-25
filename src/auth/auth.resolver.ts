import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './inputs/signup.input';
import { AuthType } from './types/auth.types';
import { TokenType } from './types/token.types';
import { UserType } from './types/user.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  async signup(@Args('data') data: SignupInput): Promise<AuthType> {
    return this.authService.signup(data);
  }

  @Mutation(() => TokenType)
  async login(@Args('data') data: SignupInput): Promise<TokenType> {
    return this.authService.login(data);
  }

  @Query(() => UserType)
  query() {
    return {};
  }
}
