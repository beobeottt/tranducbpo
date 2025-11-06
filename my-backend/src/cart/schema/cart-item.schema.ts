import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class CartItem {

  @Prop({
    type: Types.ObjectId,
    ref: 'User', 
    required: false,
    index: true, 
  })
  userId?: Types.ObjectId;

  
  @Prop({ required: false })
  productId?: string;


  @Prop({ required: true })
  productName: string;


  @Prop({ required: false })
  shopName?: string;


  @Prop({ required: true, min: 0 })
  price: number;


  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;


  @Prop({ required: false })
  image?: string;


  @Prop({ required: false, default: 'pending' })
  status?: string;
}


export const CartItemSchema = SchemaFactory.createForClass(CartItem);


CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true, sparse: true });