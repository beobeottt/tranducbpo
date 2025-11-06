// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express'; // THÊM IMPORT NÀY

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string; user: any }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}


@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleCallback(@Req() req: any, @Res() res: Response) {
  try {
    const { user } = req;

    if (!user?.email) {
      return res.status(400).send('Missing user data from Google');
    }

    let dbUser = await this.authService.findByEmail(user.email);
    if (!dbUser) {
      dbUser = await this.authService.createGoogleUser(user);
    }

    const jwt = this.jwtService.sign({ sub: dbUser._id, email: dbUser.email });
    res.redirect(`http://localhost:3001/auth/success?token=${jwt}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).send('Authentication failed');
  }
}
}