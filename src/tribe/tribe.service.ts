import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TribeClient } from '@tribeplatform/gql-client';
import {
  MemberStatusInput,
  PostMappingTypeEnum,
} from '@tribeplatform/gql-client/types';
import { Poll } from 'src/poll/entities/poll.entity';
import { threadId } from 'worker_threads';
import { SpaceType } from './types/space.type';

@Injectable()
export class TribeService {
  private client: TribeClient;
  private readonly logger = new Logger(TribeService.name);

  constructor(private configService: ConfigService) {
    this.client = new TribeClient({
      graphqlUrl: 'https://app.tribe.so/graphql',
      clientSecret: configService.get('TRIBE_CLIENT_SECRET'),
      clientId: configService.get('TRIBE_CLIENT_ID'),
    });
  }

  async generateToken(networkId: string): Promise<string> {
    try {
      const token = await this.client.generateToken({
        networkId,
      });
      return token;
    } catch (error) {
      this.logger.error(
        `Generating token for network "${networkId}" faild.`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getSpaces(networkId: string): Promise<SpaceType[]> {
    const token = await this.generateToken(networkId);
    const spaces = await this.client.spaces.list(
      {
        limit: 10,
      },
      'basic',
      token,
    );
    return spaces.nodes.map((s) => ({ id: s.id, name: s.name }));
  }

  async validateSpace(networkId: string, spaceId: string): Promise<boolean> {
    const spaces = await this.getSpaces(networkId);
    return spaces.find((space) => space.id === spaceId) ? true : false;
  }

  async sendPost(poll: Poll): Promise<void> {
    const token = await this.generateToken(poll.user.networkId);
    const postTypes = await this.client.posts.listPostTypes(
      { limit: 10 },
      'basic',
      token,
    );
    const discusstionType = postTypes.nodes.find(
      (pt) => pt.name === 'Discussion',
    );
    const template = `
      <p>
        ${poll.description}
      </p>
      <form id="pollAppFrm" data-form-id="${poll.id}">
          ${poll.options.map(
            (option) => `
            <label class="relative flex items-start">
                <div class="flex items-center h-5">
                    <input type="radio" value="${option.id}" class=" h-4 w-4 rounded text-actionPrimary-600 focus:outline-none focus:ring-transparent focus-visible:ring-actionPrimary-500 border-basicSurface-300/25" name="response">
                </div>
                <div class="ml-3 text-sm text-basicSurface-500">${option.title}</div>
            </label>
          `,
          )}
          <button id="pollBtn" data-form-id="${
            poll.id
          }" class="items-center relative focus:outline-none focus-visible:ring text-basicSurface-500 bg-surface-50 hover:bg-surface-100 font-medium shadow-sm px-4 py-2 text-sm rounded-md border border-basicSurface-300/25 w-full flex justify-center group">
              <span class="flex">
                  <span class="inline-flex items-center">Send</span>
              </span>
          </button>
      </form>
    `;

    const post = await this.client.posts.create(
      {
        spaceId: poll.spaceId,
        input: {
          postTypeId: discusstionType.id,
          mappingFields: [
            {
              key: 'title',
              type: PostMappingTypeEnum.text,
              value: JSON.stringify(poll.title),
            },
            {
              key: 'content',
              type: PostMappingTypeEnum.html,
              value: JSON.stringify(template),
            },
          ],
          publish: true,
        },
      },
      'basic',
      token,
    );
  }

  async validateMember(networkId: string, memberId: string): Promise<boolean> {
    const token = await this.generateToken(networkId);
    const member = await this.client.members.get(
      { id: memberId },
      'default',
      token,
    );

    return member ? true : false;
  }
}
