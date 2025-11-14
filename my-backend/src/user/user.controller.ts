import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Product } from 'src/product/schema/product.schema';

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
}
