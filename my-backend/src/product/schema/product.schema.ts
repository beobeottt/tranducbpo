import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductVariant {
  @Prop({ type: String, default: () => new Date().valueOf().toString() })
  id: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop()
  sku?: string;

  @Prop()
  image?: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

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

  @Prop()
  img: string;

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants?: ProductVariant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
