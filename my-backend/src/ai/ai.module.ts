import { Module } from '@nestjs/common';
import { AiService } from './ai/ai.service';

@Module({
  providers: [AiService]
})
export class AiModule {}
