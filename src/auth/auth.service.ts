import {
  BadRequestException,
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
import { TokenType } from './types/token.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) { }

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

  async login(data: SignupInput): Promise<TokenType> {
    let user, email, password;

    try {
      [email, password] = Object.values(data);
      user = await this.usersRepository.findOne({ email });
    } catch (error) {
      this.logger.error(
        `Error while finding user with data: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new BadRequestException('Invalid credntials');
    }

    if (await !bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Invalid credntials');
    }

    const accessToken = this.generateToken({ id: user.id });
    return {
      accessToken,
    };
  }

  generateToken(payload: JwtPayloadDto): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
