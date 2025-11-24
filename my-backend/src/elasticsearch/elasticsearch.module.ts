import { Module } from '@nestjs/common';
import { EsService } from './es/es.service';

@Module({
  providers: [EsService]
})
export class ElasticsearchModule {}
