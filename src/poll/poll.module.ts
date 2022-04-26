import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TribeModule } from 'src/tribe/tribe.module';
import { PollResolver } from './poll.resolver';
import { PollService } from './poll.service';
import { AnswerRepository } from './repositories/answer.repository';
import { OptionRepository } from './repositories/option.repository';
import { PollRepository } from './repositories/poll.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PollRepository,
      OptionRepository,
      AnswerRepository,
    ]),
    TribeModule,
  ],
  providers: [PollService, PollResolver],
})
export class PollModule { }
