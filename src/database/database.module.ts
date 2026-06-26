import { Global, Module } from '@nestjs/common';
import { AlarmesAguaPrismaService } from './alarmes-agua-prisma.service';

@Global()
@Module({
  providers: [AlarmesAguaPrismaService],
  exports: [AlarmesAguaPrismaService],
})
export class DatabaseModule {}
