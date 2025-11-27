import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from 'src/product/schema/product.schema';


@Injectable()
export class EsService {
  private readonly index = 'products';

  constructor(private readonly es: ElasticsearchService) {}

  async indexProduct(product: Product & { _id?: any }) {
    const id = product._id?.toString();
    if (!id) return;

    await this.es.index({
      index: this.index,
      id,
      document: {
        productName: product.productName,
        description: product.description || '',
        price: product.price,
        brand: product.brand || '',
        typeProduct: product.typeProduct,
        // thêm các field bạn muốn search
      },
    });
  }

  async searchProducts(term: string): Promise<string[]> {
    if (!term.trim()) return [];

    const result = await this.es.search({
      index: this.index,
      query: {
        multi_match: {
          query: term,
          fields: ['productName^3', 'description', 'brand'],
          fuzziness: 'AUTO',
        },
      },
      size: 100,
    });

    return result.hits.hits.map((hit: any) => hit._id as string);
  }
}