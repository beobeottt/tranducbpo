import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['percentage', 'fixed'] })
  discountType: string;

  @Prop({ required: true })
  value: number;

  @Prop({ default: 1 })
  maxUsage: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ default: 0 })
  minOrderValue: number;

  @Prop({type: Date, required: true })
  startDate: Date;

  @Prop({type: Date, required: true })
  endDate: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  applicableProducts: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  applicableUsers: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  createdBy: Types.ObjectId;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
