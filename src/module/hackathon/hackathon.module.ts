import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HackathonController } from './hackathon.controller';
import { HackathonService } from './hackathon.service';

@Module({
  controllers: [HackathonController],
  providers: [HackathonService, PrismaService],
})
export class HackathonModule {}
