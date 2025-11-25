import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from './schema/cart-item.schema';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { CartGateway } from 'src/websocket/cart/cart.gateway';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name)
    private cartItemModel: Model<CartItemDocument>,
    private readonly cartGateway: CartGateway, 
  ) {}

  // HÀM HỖ TRỢ: Gửi real-time cập nhật giỏ hàng
  private async broadcastCart(userId: string) {
    const items = await this.findByUserId(userId);
    this.cartGateway.broadcastCart(userId, items); // ← GỬI CHO TẤT CẢ TAB
  }

  async create(dto: CreateCartItemDto, userId: string) {
    const { productId, productName, price, quantity = 1 } = dto;

    const existingItem = await this.cartItemModel.findOne({
      userId: new Types.ObjectId(userId),
      productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      const saved = await existingItem.save();
      await this.broadcastCart(userId); // ← REAL-TIME
      return saved;
    }

    const newItem = new this.cartItemModel({
      userId: new Types.ObjectId(userId),
      productId,
      productName,
      price,
      quantity,
      image: dto.url || '',
      shopName: dto.shopName || '',
      status: 'pending',
    });

    const saved = await newItem.save();
    await this.broadcastCart(userId); // ← REAL-TIME
    return saved;
  }

  async findByUserId(userId: string) {
    return this.cartItemModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean() // ← TỐI ƯU HIỆU NĂNG
      .exec();
  }

  async findOne(id: string) {
    const item = await this.cartItemModel.findById(id);
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }

  async update(id: string, dto: UpdateCartItemDto, userId: string) {
    const item = await this.findOne(id);

    if (item?.userId?.toString() !== userId) {
      throw new ForbiddenException('You can only update your own cart');
    }

    const updated = await this.cartItemModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    await this.broadcastCart(userId); // ← REAL-TIME
    return updated;
  }

  async remove(id: string, userId: string) {
    const item = await this.findOne(id);

    if (item?.userId?.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own cart');
    }

    await this.cartItemModel.findByIdAndDelete(id);
    await this.broadcastCart(userId); // ← REAL-TIME
    return { deleted: true };
  }

  // Đồng bộ giỏ local → server
  async syncCart(userId: string, items: CreateCartItemDto[]) {
    const userObjectId = new Types.ObjectId(userId);
    await this.cartItemModel.deleteMany({ userId: userObjectId });

    const cartItems = items.map((item) => ({
      ...item,
      userId: userObjectId,
      status: 'pending',
    }));

    const result = await this.cartItemModel.insertMany(cartItems);
    await this.broadcastCart(userId);
    return result;
  }

  async syncGuestToUser(userId: string, guestId: string) {
    const guestItems = await this.cartItemModel.find({
      userId: new Types.ObjectId(guestId),
    });

    for (const item of guestItems) {
      const existingItem = await this.cartItemModel.findOne({
        userId: new Types.ObjectId(userId),
        productId: item.productId,
      });

      if (existingItem) {
        existingItem.quantity += item.quantity;
        await existingItem.save();
      } else {
        item.userId = new Types.ObjectId(userId);
        await item.save();
      }
    }

    await this.cartItemModel.deleteMany({ userId: new Types.ObjectId(guestId) });
    await this.broadcastCart(userId);
    return this.findByUserId(userId);
  }
}