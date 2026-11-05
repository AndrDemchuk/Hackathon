import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArcjetModule } from './lib/arcjet/arcjet.module';
import { ArcjetGuard } from './common/guards/arcjet.guard';
import { PrismaService } from './prisma.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth/auth.js';

@Module({
  imports: [ArcjetModule, AuthModule.forRoot({ auth })],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: ArcjetGuard },
  ],
})
export class AppModule { }
