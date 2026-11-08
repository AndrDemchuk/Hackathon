import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateHackathonDto, authorId: string) {
    const { startsAt, endsAt, ...rest } = dto;
    return this.prisma.hackathon.create({
      data: { ...rest, startDate: startsAt, endDate: endsAt, authorId },
    });
  }

  findAll() {
    return this.prisma.hackathon.findMany();
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({ where: { id } });
    if (!hackathon) throw new NotFoundException(`Hackathon "${id}" not found`);
    return hackathon;
  }

  async update(id: string, dto: UpdateHackathonDto) {
    await this.findOne(id);
    const { startsAt, endsAt, ...rest } = dto;
    return this.prisma.hackathon.update({
      where: { id },
      data: {
        ...rest,
        ...(startsAt !== undefined && { startDate: startsAt }),
        ...(endsAt !== undefined && { endDate: endsAt }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.hackathon.delete({ where: { id } });
  }

  async join(hackathonId: string, userId: string) {
    const hackathon = await this.findOne(hackathonId);

    if (!hackathon.isActive) {
      throw new BadRequestException('Hackathon is not active');
    }

    if (hackathon.endDate < new Date()) {
      throw new BadRequestException('Hackathon has already ended');
    }

    try {
      return await this.prisma.hackathonParticipant.create({
        data: { hackathonId, userId },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('You have already joined this hackathon');
      }
      throw e;
    }
  }
}
