import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { TribeService } from 'src/tribe/tribe.service';
import { CreatePollInput } from './inputs/create-poll.input';
import { OptionRepository } from './repositories/option.repository';
import { PollRepository } from './repositories/poll.repository';
import { PollType } from './types/poll.type';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  constructor(
    @InjectRepository(PollRepository) private pollRepository: PollRepository,
    @InjectRepository(OptionRepository)
    private optionRepository: OptionRepository,
    private tribeService: TribeService,
  ) { };

  async createPoll(user: User, data: CreatePollInput): Promise<PollType> {
    const { spaceId } = data;
    let result: boolean;

    try {
      result = await this.tribeService.validateSpace(user.networkId, spaceId);
    } catch (error) {
      this.logger.error(
        `Error while space validation for userId: ${user.id
        } with info: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    if (!result) {
      throw new UnprocessableEntityException('SpaceId is incorrect');
    }

    try {
      const poll = await this.pollRepository.createPoll(user, data);
      await this.tribeService.sendPost(poll);
      return poll;
    } catch (error) {
      this.logger.error(
        `Error while creating poll for userId: ${user.id
        } with info: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
