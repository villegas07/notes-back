import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
  providers: [UsersRepository, PrismaService],
  exports: [UsersRepository],
})
export class UsersModule {}
