import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ThreadIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const threadId = request.body.threadId;

    return !!threadId;
  }
}
