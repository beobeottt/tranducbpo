import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { Review, ReviewDocument } from './schema/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Product with ID ${id} not found`);
  }

  async findByBrandName(brand: string)
  {
    return this.productModel
    .find({brand: brand})
    .select('_id productName price img quantity brand typeProduct')
    .exec();
  }
  async createReview(
  productId: string,
  userId: string | null,
  fullname: string,
  dto: CreateReviewDto,
) {
  const review = await this.reviewModel.create({
    productId,
    userId,
    fullname,
    rating: dto.rating,
    comment: dto.comment,
  });

  // Cập nhật stats
  const stats = await this.reviewModel.aggregate([
    { $match: { productId: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      totalReviews: stats[0].totalReviews,
    });
  }

  return review;
}




async getReviews(productId: string) {
  return this.reviewModel
    .find({ productId })
    .sort({ createdAt: -1 });
}

async filterProducts(dto: FilterProductDto) {
  console.log('FilterProducts called with DTO:', dto);
  
  // Kiểm tra priceMin <= priceMax (chỉ khi cả 2 đều có giá trị)
  if (dto.priceMin !== undefined && dto.priceMax !== undefined && dto.priceMin > dto.priceMax) {
    throw new BadRequestException('Giá tối thiểu không được lớn hơn giá tối đa');
  }

  // Xây dựng query - chỉ thêm các field có giá trị
  const query: any = {};
  
  // Kiểm tra xem có filter nào không
  const hasFilters = 
    dto.brand || 
    dto.priceMin !== undefined || 
    dto.priceMax !== undefined ||
    dto.typeProduct ||
    dto.minQuantity !== undefined ||
    dto.search;
  
  if (!hasFilters) {
    // Nếu không có filter nào, trả về tất cả sản phẩm
    console.log('No filters, returning all products');
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;
    
    let sort: any = { createdAt: -1 };
    if (dto.sortBy) {
      switch (dto.sortBy) {
        case 'price-asc': sort = { price: 1 }; break;
        case 'price-desc': sort = { price: -1 }; break;
        case 'name-asc': sort = { productName: 1 }; break;
        case 'name-desc': sort = { productName: -1 }; break;
        case 'newest': sort = { createdAt: -1 }; break;
      }
    }
    
    const [products, total] = await Promise.all([
      this.productModel.find({}).sort(sort).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments({}).exec(),
    ]);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {},
    };
  }

  // Thêm brand nếu có
  if (dto.brand) {
    query.brand = dto.brand;
  }

  // Thêm price range nếu có
  if (dto.priceMin !== undefined || dto.priceMax !== undefined) {
    query.price = {};
    if (dto.priceMin !== undefined) {
      query.price.$gte = dto.priceMin;
    }
    if (dto.priceMax !== undefined) {
      query.price.$lte = dto.priceMax;
    }
  }

  // Thêm các tiêu chí tùy chọn
  if (dto.typeProduct) {
    query.typeProduct = dto.typeProduct;
  }

  if (dto.minQuantity !== undefined) {
    query.quantity = { $gte: dto.minQuantity };
  }

  if (dto.search) {
    query.$or = [
      { productName: { $regex: dto.search, $options: 'i' } },
      { description: { $regex: dto.search, $options: 'i' } },
    ];
  }

  // Sắp xếp
  let sort: any = {};
  switch (dto.sortBy) {
    case 'price-asc':
      sort = { price: 1 };
      break;
    case 'price-desc':
      sort = { price: -1 };
      break;
    case 'name-asc':
      sort = { productName: 1 };
      break;
    case 'name-desc':
      sort = { productName: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  // Phân trang
  const page = dto.page || 1;
  const limit = dto.limit || 10;
  const skip = (page - 1) * limit;

  console.log('MongoDB Query:', JSON.stringify(query, null, 2));
  
  // Thực hiện query
  const [products, total] = await Promise.all([
    this.productModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
    this.productModel.countDocuments(query).exec(),
  ]);
  
  console.log(`Found ${products.length} products, total: ${total}`);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filters: {
      brand: dto.brand || undefined,
      priceMin: dto.priceMin || undefined,
      priceMax: dto.priceMax || undefined,
      typeProduct: dto.typeProduct || undefined,
      minQuantity: dto.minQuantity || undefined,
      search: dto.search || undefined,
    },
  };
}

}
