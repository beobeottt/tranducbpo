import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OrderDocument = Order & Document;

@Schema({timestamps: true})
export class Order{

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

  @Prop({
    enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
    default: 'Pending',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);