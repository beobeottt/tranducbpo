import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}


  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hashed });
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { token };
  }


  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { token, user };
  }


  async findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

async createGoogleUser(googleData: any) {
  try {
    const userData = {
      email: googleData.email,
      fullname: googleData.fullname || 'Unknown',
      avatar: googleData.avatar,
      googleId: googleData.googleId,
      role: 'user',
    };
    return await this.userService.create(userData);
  } catch (error) {
    console.error('Create Google user failed:', error);
    throw new Error('Failed to create user');
  }
}
}