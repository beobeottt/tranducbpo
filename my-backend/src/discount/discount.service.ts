import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Discount } from './schema/discount.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
    constructor(@InjectModel(Discount.name) private discountModel: Model<Discount>) { }


    async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
        const discount = new this.discountModel(createDiscountDto);
        return discount.save();
    }

    async findAll(): Promise<Discount[]> {
        return this.discountModel.find().exec();
    }

    async findOne(id: string): Promise<Discount> {
        const discount = await this.discountModel.findById(id).exec();
        if (!discount) {
            throw new NotFoundException('Discount not found');
        }

        return discount;
    }

    async findByCode(code: string): Promise<Discount> {
  try {
    const discount = await this.discountModel.findOne({
      code: code.toUpperCase(),
    });

    if (!discount) {
      throw new NotFoundException('Discount code not found');
    }

    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);

    // Nếu start hoặc end không hợp lệ
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new InternalServerErrorException('Invalid date format in discount');
    }

    if (start > now) {
      throw new BadRequestException('Discount not started yet');
    }

    if (end < now) {
      throw new BadRequestException('Discount expired');
    }

    return discount;
  } catch (error) {
    console.error('Error in findByCode():', error);
    throw new InternalServerErrorException(error.message || 'Internal server error');
  }
}



    async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
        const discount = await this.discountModel.findByIdAndUpdate(id, updateDiscountDto, { new: true }).exec();
        if (!discount) throw new NotFoundException('Discount not found');
        return discount;
    }

    async remove(id: string): Promise<void> {
        const result = await this.discountModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Discount not found');
    }
}
