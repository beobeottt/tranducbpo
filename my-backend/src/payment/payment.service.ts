import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { CartItem, CartItemDocument } from 'src/cart/schema/cart-item.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
  ) {}

  async createPayment(method: string, items: CartItem[]): Promise<Payment> {
    // Lưu cart items vào collection CartItem
    const createdItems = await this.cartItemModel.insertMany(items);

    // Tạo payment
    const newPayment = new this.paymentModel({
      method,
      items: createdItems.map((i) => i._id),
    });

    return newPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('items').exec();
  }
}
