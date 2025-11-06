import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({required: true})
  brand: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ enum: ['New Product', 'Best Seller'], default: 'New Product' })
  typeProduct: 'New Product' | 'Best Seller';
}

export const ProductSchema = SchemaFactory.createForClass(Product);
