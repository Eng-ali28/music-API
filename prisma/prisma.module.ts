import { Module } from '@nestjs/common/decorators';
import PrismaService from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule {}
