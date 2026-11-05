import { Body, Controller, Get, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers() {
    return this.prisma.user.findMany({
      include: { posts: true },
    });
  }

  @Post('users')
  createUser(@Body() body: { email: string; name?: string }) {
    return this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: body.email,
        name: body.name ?? body.email,
        emailVerified: false,
      },
    });
  }
}
