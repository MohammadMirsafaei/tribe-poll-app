import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollResolver } from './poll.resolver';
import { PollService } from './poll.service';
import { OptionRepository } from './repositories/option.repository';
import { PollRepository } from './repositories/poll.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PollRepository, OptionRepository])],
  providers: [PollService, PollResolver],
})
export class PollModule { }
