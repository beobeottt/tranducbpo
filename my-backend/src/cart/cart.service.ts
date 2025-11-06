// src/cart/cart.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
    [x: string]: any;
  constructor(
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
  ) {}

  // Tạo mới (có userId)
  async create(dto: CreateCartItemDto, userId: string) {
    const cartItem = new this.cartItemModel({
      ...dto,
      userId: new Types.ObjectId(userId), // CHUYỂN STRING → ObjectId
    });
    return cartItem.save();
  }

  // Đồng bộ giỏ hàng local
  async syncCart(userId: string, items: CreateCartItemDto[]) {
    const userObjectId = new Types.ObjectId(userId);

    // Xóa giỏ cũ của user
    await this.cartItemModel.deleteMany({ userId: userObjectId });

    // Thêm mới
    const cartItems = items.map(item => ({
      ...item,
      userId: userObjectId,
    }));

    return this.cartItemModel.insertMany(cartItems);
  }

  async findByUserId(userId: string) {
    return this.cartItemModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const item = await this.cartItemModel.findById(id);
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }

async update(id: string, dto: UpdateCartItemDto, userId: string) {
  const item = await this.findOne(id);

  // KIỂM TRA userId CÓ TỒN TẠI VÀ KHỚP
  if (!item.userId || item.userId.toString() !== userId) {
    throw new ForbiddenException('You can only update your own cart');
  }

  return this.cartItemModel.findByIdAndUpdate(id, dto, { new: true });
}

async remove(id: string, userId: string) {
  const item = await this.findOne(id);

  // KIỂM TRA userId
  if (!item.userId || item.userId.toString() !== userId) {
    throw new ForbiddenException('You can only delete your own cart');
  }

  await this.cartItemModel.findByIdAndDelete(id);
  return { deleted: true };
}
}