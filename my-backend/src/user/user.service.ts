
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { Product } from 'src/product/schema/product.schema';
import { ShippingAddressDto, UpdateShippingAddressDto } from './dto/shipping-address.dto';

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

  async getShippingAddresses(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.shippingAddresses || [];
  }

  async addShippingAddress(userId: string, dto: ShippingAddressDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = user.shippingAddresses ?? [];
    const newAddress = {
      id: dto.id || new Types.ObjectId().toString(),
      label: dto.label,
      fullName: dto.fullName,
      phone: dto.phone,
      addressLine: dto.addressLine,
      ward: dto.ward,
      district: dto.district,
      city: dto.city,
      note: dto.note,
      isDefault: dto.isDefault ?? addresses.length === 0,
    };

    if (newAddress.isDefault) {
      addresses.forEach((addr: any) => (addr.isDefault = false));
    }

    addresses.push(newAddress as any);
    user.shippingAddresses = addresses;
    await user.save();
    return user.shippingAddresses;
  }

  async updateShippingAddress(
    userId: string,
    addressId: string,
    dto: UpdateShippingAddressDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = user.shippingAddresses ?? [];
    const target = addresses.find((addr: any) => addr.id === addressId);
    if (!target) {
      throw new NotFoundException('Address not found');
    }

    Object.assign(target, dto);
    if (dto.isDefault) {
      addresses.forEach((addr: any) => {
        addr.isDefault = addr.id === addressId;
      });
    }

    user.shippingAddresses = addresses;
    await user.save();
    return user.shippingAddresses;
  }

  async removeShippingAddress(userId: string, addressId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = user.shippingAddresses ?? [];
    const index = addresses.findIndex((addr: any) => addr.id === addressId);
    if (index === -1) {
      throw new NotFoundException('Address not found');
    }

    const removed = addresses.splice(index, 1)[0];

    if (removed?.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }

    user.shippingAddresses = addresses;
    await user.save();
    return user.shippingAddresses;
  }

  async setDefaultShippingAddress(userId: string, addressId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = user.shippingAddresses ?? [];
    const target = addresses.find((addr: any) => addr.id === addressId);
    if (!target) {
      throw new NotFoundException('Address not found');
    }

    addresses.forEach((addr: any) => {
      addr.isDefault = addr.id === addressId;
    });
    user.shippingAddresses = addresses;
    await user.save();
    return user.shippingAddresses;
  }
}