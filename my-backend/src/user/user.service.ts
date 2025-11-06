// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema'; 
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

    async create(dto: CreateUserDto): Promise<UserDocument>;
    async create(dto: CreateGoogleUserDto): Promise<UserDocument>;
    async create(dto: any): Promise<UserDocument> {
  try {
    const exists = await this.userModel.findOne({ email: dto.email }).exec();
    if (exists) {
      return exists;
    }
    const created = new this.userModel(dto);
    return await created.save();
  } catch (error) {
    console.error('User create error:', error);
    throw error;
  }
}



  // Tìm tất cả
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Tìm theo ID
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Tìm theo email (dùng cho Google Login)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Cập nhật user
  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Xóa user
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}