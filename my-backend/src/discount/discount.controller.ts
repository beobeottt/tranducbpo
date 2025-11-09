import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Controller('discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService){}

    @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')

  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Get('code/:code')
  async getDiscountByCode(@Param('code') code: string) {
    const discount = await this.discountService.findByCode(code);
    if (!discount) {
      throw new NotFoundException('Discount code not found');
    }
    return discount;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }

}
