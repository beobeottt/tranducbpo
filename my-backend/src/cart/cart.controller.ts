
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { CartItem } from './schema/cart-item.schema';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ---------- THÊM ----------
  @Post()
  @UseGuards(JwtAuthGuard)               // bắt buộc login
  async create(@Body() dto: CreateCartItemDto, @Req() req: any) {
    const userId = req.user.id;          // req.user được JwtStrategy inject
    return this.cartService.create(dto, userId);
  }

  // ---------- ĐỒNG BỘ GUEST ----------
  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncGuestCart(@Req() req: any, @Body('guestId') guestId: string) {
    const userId = req.user.id;
    return this.cartService.syncGuestToUser(userId, guestId);
  }

  // ---------- LẤY CART CỦA USER ----------
  @Get()
  @UseGuards(JwtAuthGuard)               
  async getMyCart(@Req() req: any) {
    const userId = req.user.id;
    return this.cartService.findByUserId(userId);
  }

  @Get('user/:userId') // lấy userId để solve ra cart của user đó
  @UseGuards(JwtAuthGuard) // Bảo vệ
  async findByUserId(@Param('userId') userId: string) {
    return this.cartService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCartItemDto, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.cartService.remove(id, userId);
  }
}