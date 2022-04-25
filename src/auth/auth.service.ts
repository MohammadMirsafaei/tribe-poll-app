import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { SignupInput } from './inputs/signup.input';
import { UsersRepository } from './repositories/users.repository';
import { AuthType } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthType> {
    try {
      const user = await this.usersRepository.createUser(signupInput);
      const accessToken = this.generateToken({ id: user.id });
      return {
        user,
        accessToken,
      };
    } catch (error) {
      this.logger.error(
        `Error in creating user with data: ${JSON.stringify(signupInput)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  generateToken(payload: JwtPayloadDto): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
