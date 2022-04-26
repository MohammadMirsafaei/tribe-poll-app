import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GqlGuard } from 'src/auth/guards/gqp.guard';
import { TribeService } from './tribe.service';
import { SpaceType } from './types/space.type';

@Resolver()
@UseGuards(GqlGuard)
export class TribeResolver {
  constructor(private tribeService: TribeService) { }

  @Query(() => [SpaceType])
  async getSpaces(@GetUser() user: User): Promise<SpaceType[]> {
    return this.tribeService.getSpaces(user.networkId);
  }
}
