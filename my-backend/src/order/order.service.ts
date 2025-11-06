import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order>
    {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async findAll(): Promise<Order[]>
    {
        return this.orderModel.find().exec();
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return this.orderModel.find({ userId }).exec();
    }

    async findOne(id: string): Promise<Order>{
        const order = await this.orderModel.findById(id).exec();
        if(!order)
        {
            throw new NotFoundException(`Order with id ${id} not found`);
        }

        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>
    {
        const updated = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Order with id ${id} not found`);
    return updated;
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Order with id ${id} not found`);
    return { deleted: true };
  }
}
