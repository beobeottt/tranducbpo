import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto, LoginDto } from './dto/auth.dto';
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
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { token };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { token, user };
  }

  async findByEmail(email: string) {
    return this.userService.findByEmail(email);
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

  const token = this.jwtService.sign({
    sub: user._id,
    email: user.email,
  });

  return { token };
}

}
