import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { EsService } from './es/es.service';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
  ],
  providers: [EsService],
  exports: [EsService],
})
export class ElasticsearchModule {}
