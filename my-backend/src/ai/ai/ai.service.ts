import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private client: Groq | null = null;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.client = new Groq({ apiKey });
    }
  }

  async chat(message: string): Promise<string> {
    if (!this.client) {
      throw new InternalServerErrorException('AI service is not configured');
    }

    const completion = await this.client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'Bạn là chatbot gợi ý sản phẩm cho một website thương mại điện tử. Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    return completion.choices[0]?.message?.content || 'Xin lỗi, hiện tôi chưa trả lời được.';
  }
}

