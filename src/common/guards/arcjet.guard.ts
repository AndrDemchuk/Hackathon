import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ArcjetService } from '../../lib/arcjet/arcjet.service';

@Injectable()
export class ArcjetGuard implements CanActivate {
  private readonly logger = new Logger(ArcjetGuard.name);

  constructor(private readonly arcjet: ArcjetService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const decision = await this.arcjet.client.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }
      this.logger.warn(`Arcjet denied request: ${decision.reason.type}`);
      throw new ForbiddenException('Request blocked');
    }

    return true;
  }
}
