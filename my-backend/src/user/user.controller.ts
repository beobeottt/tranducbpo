import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Product } from 'src/product/schema/product.schema';
import { ShippingAddressDto, UpdateShippingAddressDto } from './dto/shipping-address.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
  @Post('favourite/:productId')
  async toggleFavourites(@Req() req: Request, @Param('productId') productId: string) {
    const id = (req as any).user?.sub; 
    const updatedUser = await this.userService.toggleFavourite(id, productId);

    return {
      message: 'Favourite list updated',
      favourites: updatedUser.favourites,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('favourites')
  async getFavourites(@Req() req: Request): Promise<Product[]> {
    const id = (req as any).user?.sub; 
    return this.userService.getFavourites(id);
  }

  @Get('favourites/:id')
  async getUserFavourites(@Param('id') id: string): Promise<Product[]> {
    return this.userService.getFavourites(id);
  }


    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('addresses/me')
    async getMyAddresses(@Req() req: Request) {
      const userId = (req as any).user?.sub;
      return this.userService.getShippingAddresses(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('addresses')
    async addAddress(
      @Req() req: Request,
      @Body() dto: ShippingAddressDto,
    ) {
      const userId = (req as any).user?.sub;
      return this.userService.addShippingAddress(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('addresses/:addressId')
    async updateAddress(
      @Req() req: Request,
      @Param('addressId') addressId: string,
      @Body() dto: UpdateShippingAddressDto,
    ) {
      const userId = (req as any).user?.sub;
      return this.userService.updateShippingAddress(userId, addressId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('addresses/:addressId')
    async deleteAddress(
      @Req() req: Request,
      @Param('addressId') addressId: string,
    ) {
      const userId = (req as any).user?.sub;
      return this.userService.removeShippingAddress(userId, addressId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('addresses/:addressId/default')
    async setDefaultAddress(
      @Req() req: Request,
      @Param('addressId') addressId: string,
    ) {
      const userId = (req as any).user?.sub;
      return this.userService.setDefaultShippingAddress(userId, addressId);
    }
}
