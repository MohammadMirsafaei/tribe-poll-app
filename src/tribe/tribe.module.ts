import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TribeResolver } from './tribe.resolver';
import { TribeService } from './tribe.service';

@Module({
  imports: [ConfigModule],
  providers: [TribeService, TribeResolver],
  exports: [TribeService],
})
export class TribeModule { }
