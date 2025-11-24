import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hashed });
    const userId = (user as any)._id?.toString() || user.id?.toString();
    const token = this.jwtService.sign({ 
      sub: userId, 
      id: userId,
      email: user.email 
    });
    return { token };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const userId = (user as any)._id?.toString() || user.id?.toString();
    const token = this.jwtService.sign({ 
      sub: userId, 
      id: userId,
      email: user.email 
    });
    return { token, user };
  }

  async findByEmail(email: string) {
    return this.userService.findByEmail(email);
  }
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new BadRequestException('User không tồn tại');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password!);
    if (!isMatch)
      throw new BadRequestException('Mật khẩu hiện tại không đúng');

    if (dto.currentPassword === dto.newPassword)
      throw new BadRequestException(
        'Mật khẩu mới không được giống mật khẩu cũ',
      );

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;
    await user.save();

    return { message: 'Đổi mật khẩu thành công!' };
  }



  async forgotPassword(email: string) {
  const user = await this.userService.findByEmail(email);

  if (!user) {
    throw new UnauthorizedException('Email not found');
  }
  const newPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  await this.mailService.sendPasswordEmail(
    email,
    newPassword,
    user.fullname || 'User'
  );

  return { message: 'A new password has been sent to your email' };
}

  async createGoogleUser(googleUser: any): Promise<{ token: string }> {
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  let user = await this.userService.findByEmail(googleUser.email);

  if (!user) {
    user = await this.userService.create({
      fullname: googleUser.fullname || googleUser.displayName || 'Google User',
      email: googleUser.email,
      password: hashedPassword,
      avatar: googleUser.picture,
      shippingAddress: '',
      point: 0,
      gender: 'Male',
    });

    await this.mailService.sendPasswordEmail(
      googleUser.email,
      randomPassword,
      googleUser.name || 'User',
    );
  }

  const userId = (user as any)._id?.toString() || user.id?.toString();
  const token = this.jwtService.sign({
    sub: userId,
    id: userId,
    email: user.email,
  });

  return { token };
}
async createGuestUser(email: string, shippingAddress: string) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    let user = await this.userService.findByEmail(email);
    let password: string;

    if (!user) {
      
      user = await this.userService.create({
        email,
        password: hashedPassword,
        fullname: 'Google User',
        shippingAddress,
      });

      await this.mailService.sendPasswordEmail(email, randomPassword, 'Guest User');
    } else {
      user.shippingAddress = shippingAddress;
      await user.save();
    }

    const userId = (user as any)._id?.toString() || user.id?.toString();
    const payload = { 
      sub: userId, 
      id: userId,
      email: user.email 
    };
    const token = this.jwtService.sign(payload);

    return { message: 'Guest account created or updated', token };
  }

  async registerQuick(email: string, fullname: string, address: string) {

  let user = await this.userService.findByEmail(email);
  if (user) {
    throw new UnauthorizedException('Email đã tồn tại!');
  }

  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);
  user = await this.userService.create({
    email,
    fullname,
    password: hashedPassword,
    shippingAddress: address,
    avatar: '',
    point: 0,
    gender: 'Male',
  });
  await this.mailService.sendPasswordEmail(email, randomPassword, fullname);
  const userId = (user as any)._id?.toString() || user.id?.toString();
  const token = this.jwtService.sign({
    sub: userId,
    id: userId,
    email: user.email,
  });

  return { token, message: 'Register success' };
}

}
