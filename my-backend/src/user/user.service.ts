
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema'; 
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

    async create(dto: CreateUserDto | CreateGoogleUserDto): Promise<UserDocument> {
  try {
    const exists = await this.userModel.findOne({ email: dto.email }).exec();
    if (exists) return exists;

    const created = new this.userModel(dto);
    return await created.save();
  } catch (error) {
    console.error('User create error:', error);
    throw error;
  }
}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async toggleFavourite(id: string, productId: string): Promise<UserDocument> {
  const user = await this.userModel.findById(id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const index = user.favourites.findIndex(
    (fav) => fav.toString() === productId,
  );

  if (index > -1) {
    user.favourites.splice(index, 1);
  } else {
    user.favourites.push(new Types.ObjectId(productId));
  }

  await user.save();
  const updatedUser = await this.userModel.findById(id).populate('favourites');
  if (!updatedUser) {
    throw new NotFoundException('User not found after update');
  }

  return updatedUser;
}


  async getFavourites(id: string): Promise<Product[]> {
  const user = await this.userModel
    .findById(id)
    .populate<{ favourites: Product[] }>('favourites')
    .exec();

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user.favourites;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}