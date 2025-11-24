// src/cart/cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // THÊM SẢN PHẨM VÀO GIỎ HÀNG (CHỈ DÙNG 1 ENDPOINT DUY NHẤT)
  @Post()
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() dto: CreateCartItemDto, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.create(dto, userId);
  }

  // ĐỒNG BỘ GIỎ HÀNG GUEST (nếu cần giữ lại)
  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncGuestCart(@Req() req: any, @Body() body: { guestId: string }) {
    const userId = req.user.id;
    return this.cartService.syncGuestToUser(userId, body.guestId);
  }

  
  @Get()
@UseGuards(JwtAuthGuard)
async getMyCart(@Req() req: any) {
  const userId = req.user.id;
  const items = await this.cartService.findByUserId(userId);
  return { items };
}

  // LẤY GIỎ HÀNG CỦA USER KHÁC (admin dùng)
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async findByUserId(@Param('userId') userId: string) {
    return this.cartService.findByUserId(userId);
  }

  // LẤY 1 ITEM THEO ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  // CẬP NHẬT SỐ LƯỢNG
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.cartService.update(id, dto, userId);
  }

  // XÓA ITEM KHỎI GIỎ
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.remove(id, userId);
  }
}