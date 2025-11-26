import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CartItem, CartItemDocument } from 'src/cart/schema/cart-item.schema';

@Injectable()
export class OrderService {
    constructor(
      @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order>
    {
        const user = await this.userModel.findById(createOrderDto.userId).exec();
        if (!user) {
          throw new NotFoundException(`User with id ${createOrderDto.userId} not found`);
        }

        const itemTotal = createOrderDto.totalPrice ?? createOrderDto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const currentPoints = user.point ?? 0;
        const requestedPoints = Math.max(0, Math.floor(createOrderDto.pointsToRedeem ?? 0));
        const usablePoints = Math.min(requestedPoints, currentPoints, Math.floor(itemTotal));
        const payableAmount = Math.max(itemTotal - usablePoints, 0);
        const pointsEarned = Math.floor(payableAmount * 0.1);

        const statusHistoryEntry = {
          status: 'Pending',
          timestamp: new Date(),
        };

        const { pointsToRedeem, ...payload } = createOrderDto;
        const newOrder = new this.orderModel({
          ...payload,
          totalPrice: itemTotal,
          payableAmount,
          pointsRedeemed: usablePoints,
          pointsEarned,
          statusHistory: [statusHistoryEntry],
        });

        await newOrder.save();

        user.point = currentPoints - usablePoints + pointsEarned;
        await user.save();

        const productIds = createOrderDto.items
          .map((item) => item.productId)
          .filter((id): id is string => Boolean(id));

        if (productIds.length > 0) {
          await this.cartItemModel.deleteMany({
            userId: new Types.ObjectId(createOrderDto.userId),
            productId: { $in: productIds },
          });
        }

        return newOrder;
    }

    async findAll(): Promise<Order[]>
    {
        return this.orderModel.find().exec();
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
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
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
          throw new NotFoundException(`Order with id ${id} not found`);
        }

        const hasStatusUpdate = typeof updateOrderDto.status === 'string';
        const statusChanged = hasStatusUpdate && updateOrderDto.status !== order.status;
        Object.assign(order, updateOrderDto);

        if (statusChanged && updateOrderDto.status) {
          order.statusHistory = [
            {
              status: updateOrderDto.status,
              timestamp: new Date(),
            },
            ...(order.statusHistory || []),
          ];
        }

        return order.save();
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Order with id ${id} not found`);
    return { deleted: true };
  }
}
