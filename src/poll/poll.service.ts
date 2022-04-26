import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { TribeService } from 'src/tribe/tribe.service';
import { Option } from './entities/option.entity';
import { Poll } from './entities/poll.entity';
import { AnswerInput } from './inputs/answer.input';
import { CreatePollInput } from './inputs/create-poll.input';
import { AnswerRepository } from './repositories/answer.repository';
import { OptionRepository } from './repositories/option.repository';
import { PollRepository } from './repositories/poll.repository';
import { AnswerType } from './types/answer.type';
import { PollWithResultType } from './types/poll-with-result.type';
import { PollType } from './types/poll.type';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  constructor(
    @InjectRepository(PollRepository) private pollRepository: PollRepository,

    @InjectRepository(OptionRepository)
    private optionRepository: OptionRepository,

    @InjectRepository(AnswerRepository)
    private answerRepository: AnswerRepository,

    private tribeService: TribeService,
  ) {}

  async createPoll(user: User, data: CreatePollInput): Promise<PollType> {
    const { spaceId } = data;
    let result: boolean;

    try {
      result = await this.tribeService.validateSpace(user.networkId, spaceId);
    } catch (error) {
      this.logger.error(
        `Error while space validation for userId: ${
          user.id
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
        `Error while creating poll for userId: ${
          user.id
        } with info: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async answer(data: AnswerInput): Promise<AnswerType> {
    const { optionId, pollId, memberId } = data;

    let poll: Poll;
    let option: Option;

    try {
      poll = await this.pollRepository.findOne(pollId, {
        relations: ['user'],
        loadEagerRelations: true,
      });
    } catch (error) {
      this.logger.error(
        `Error while poll validation with info: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    if (!poll) {
      throw new NotFoundException('Invalid pollId');
    }

    try {
      option = await this.optionRepository.findOne(optionId);
    } catch (error) {
      this.logger.error(
        `Error while option validation with info: ${JSON.stringify(data)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    if (!option) {
      throw new NotFoundException('Invalid optionId');
    }

    let result: boolean;
    try {
      result = await this.tribeService.validateMember(
        poll.user.networkId,
        memberId,
      );
    } catch (error) {
      if (error.response.errors.find((err) => err.code === 10)) {
        throw new UnprocessableEntityException('Invalid userId');
      }
      this.logger.error(
        `Error while member validation with info: ${JSON.stringify(data)}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }

    if (!result) {
      throw new UnprocessableEntityException('Invalid memberId');
    }

    return this.answerRepository.createAnswer(poll, option, memberId);
  }

  async getPolls(user: User): Promise<PollType[]> {
    return this.pollRepository.getUserPolls(user);
  }

  async getPoll(user: User, pollId: string): Promise<PollWithResultType> {
    let poll: Poll;

    try {
      poll = await this.pollRepository.findOne(pollId, {
        relations: ['user', 'answers', 'answers.option', 'options'],
        loadEagerRelations: true,
      });
    } catch (error) {
      this.logger.error(
        `Error while poll validation for userId: ${user.id} with pollId: ${pollId}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    if (!poll || poll.user.id !== user.id) {
      throw new NotFoundException('Invalid pollId');
    }

    const results = poll.options.map((option) => ({
      option,
      value:
        Math.round(
          poll.answers.filter((answer) => answer.option.id === option.id)
            .length / poll.answers.length,
        ) * 100,
    }));

    return { ...poll, results };
  }
}
