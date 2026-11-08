import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AllowAnonymous,
  AuthGuard,
  Roles,
  Session,
} from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { auth } from '../../lib/auth/auth';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';
import { HackathonService } from './hackathon.service';

@Controller('hackathon')
@UseGuards(AuthGuard)
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Post()
  @Roles(['admin'])
  @ResponseMessage('Hackathon created')
  create(
    @Body() dto: CreateHackathonDto,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.hackathonService.create(dto, session.user.id);
  }

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.hackathonService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.hackathonService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ResponseMessage('Hackathon updated')
  update(@Param('id') id: string, @Body() dto: UpdateHackathonDto) {
    return this.hackathonService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ResponseMessage('Hackathon deleted')
  remove(@Param('id') id: string) {
    return this.hackathonService.remove(id);
  }

  @Post(':id/join')
  @Roles(['participant'])
  @ResponseMessage('Successfully joined hackathon')
  join(
    @Param('id') id: string,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.hackathonService.join(id, session.user.id);
  }
}
