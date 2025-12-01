import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';
import { Product } from 'src/product/schema/product.schema';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ type: String, default: () => new mongoose.Types.ObjectId().toString() })
  id: string;

  @Prop()
  label?: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  addressLine: string;

  @Prop()
  ward?: string;

  @Prop()
  district?: string;

  @Prop()
  city?: string;

  @Prop()
  note?: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    fullname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password?: string;

    @Prop()
    shippingAddress?: string;

    @Prop({ type: [ShippingAddressSchema], default: [] })
    shippingAddresses?: ShippingAddress[];

    @Prop()
    gender?: Gender;

    @Prop({ default: 0 })
    point?: number;

    @Prop()
    role?: string;

    @Prop()
    avatar?: string;

    @Prop()
    googleId?: string;


    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }] })
    favourites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);