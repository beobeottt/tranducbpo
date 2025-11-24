import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: any }> {
    return this.authService.login(loginDto);
  }

  @Post('guest')
  async guestCheckout(
    @Body('email') email: string,
    @Body('shippingAddress') shippingAddress: string,
  ) {
    return this.authService.createGuestUser(email, shippingAddress);
  }

  @Post('check-email')
  async checkEmail(@Body('email') email: string) {
    const exists = await this.authService.findByEmail(email);
    return { exists: !!exists };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() dto: ChangePasswordDto,
  ) {
    const id = req.user.id || req.user.sub; 
    return await this.authService.changePassword(id, dto);
  }



  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }
  @Post('register-quick')
  async registerQuick(
    @Body('email') email: string,
    @Body('fullname') fullname: string,
    @Body('address') address: string,
  ) {
    return this.authService.registerQuick(email, fullname, address);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect handled by Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const user = req.user;
      if (!user?.email) {
        return res.status(400).send('Missing user data from Google');
      }
      console.log('Google user data:', user);
      const { token } = await this.authService.createGoogleUser(user);
      console.log('Generated token:', token);
      return res.redirect(`http://localhost:3001/auth/success?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.status(500).send('Authentication failed');
    }
  }

}
