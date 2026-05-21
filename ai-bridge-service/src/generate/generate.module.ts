import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
