import { Module } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { AiController } from './ai.controller';

@Module({
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
