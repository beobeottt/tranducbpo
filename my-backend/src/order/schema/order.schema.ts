import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderShippingAddress {
  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  addressLine: string;

  @Prop()
  ward?: string;

  @Prop()
  district?: string;

  @Prop()
  city?: string;

  @Prop()
  note?: string;
}

export const OrderShippingAddressSchema =
  SchemaFactory.createForClass(OrderShippingAddress);

@Schema({timestamps: true})
export class Order{

    _id: string;

    @Prop({ required: true })
    userId: string;

    @Prop([
        {
            productId: { type: String, required: true },
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
        }
    ])

    items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 0 })
  payableAmount: number;

  @Prop({ default: 0 })
  pointsRedeemed: number;

  @Prop({ default: 0 })
  pointsEarned: number;

  @Prop({
    type: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    default: [],
  })
  statusHistory: { status: string; timestamp: Date }[];

  @Prop({
    enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  @Prop({ type: OrderShippingAddressSchema })
  shippingAddress?: OrderShippingAddress;
}

export const OrderSchema = SchemaFactory.createForClass(Order);