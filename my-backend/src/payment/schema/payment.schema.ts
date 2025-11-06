import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CartItem } from "src/cart/schema/cart-item.schema";


export type PaymentDocument = Payment & Document;

@Schema()
export class Payment{
    @Prop({require: true})
    method: string;

    @Prop({default: Date.now})
    date: Date;

    @Prop({type: [{type: Types.ObjectId, ref: CartItem.name}]})
    items: CartItem[];
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);