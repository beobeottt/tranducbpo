import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai/ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    const reply = await this.aiService.chat(message);
    return { reply };
  }
}


