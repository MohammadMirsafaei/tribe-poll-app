import { Module } from '@nestjs/common';
import { TribeService } from './tribe.service';

@Module({
  providers: [TribeService]
})
export class TribeModule {}
