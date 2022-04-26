import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext) =>
    GqlExecutionContext.create(ctx).getContext().req.user,
);
