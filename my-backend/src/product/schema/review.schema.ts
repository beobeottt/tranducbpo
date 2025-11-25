import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, required: false })
  userId: string | null;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: "Khách vãng lai" })
  fullname: string;
}


export const ReviewSchema = SchemaFactory.createForClass(Review);
