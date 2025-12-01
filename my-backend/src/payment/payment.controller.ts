import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CartItem } from 'src/cart/schema/cart-item.schema';
import { CreateVNPayPaymentDto } from './dto/create-vnpay-payment.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

    @Post()
    async create(
        @Body() body: {method: string; items: CartItem[]},
    )
    {
        return this.paymentService.createPayment(body.method, body.items);
    }

    @Get()
    async findAll()
    {
        return this.paymentService.findAll();
    }

    @Post('vnpay/create')
    createVNPayPayment(
      @Body(new ValidationPipe({ transform: true }))
      dto: CreateVNPayPaymentDto,
      @Req() req: Request,
    ) {
      const ipAddr =
        ((req.headers['x-forwarded-for'] as string) || '')
          .split(',')[0]
          .trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        '127.0.0.1';

      return this.paymentService.createVNPayPayment({
        amount: dto.amount,
        orderDescription: dto.orderDescription,
        bankCode: dto.bankCode,
        locale: dto.locale,
        ipAddr,
      });
    }

    @Get('vnpay/return')
    handleVNPayReturn(
      @Query() query: Record<string, string>,
      @Res() res: Response,
    ) {
      const result = this.paymentService.verifyVNPayReturn(query);
      const frontendUrl =
        this.configService.get<string>('VNPAY_FRONTEND_RESULT_URL') ||
        'http://localhost:3001/payment/vnpay-result';

      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set(
        'status',
        result.isSuccess ? 'success' : 'failed',
      );
      redirectUrl.searchParams.set('orderId', result.orderId || '');
      redirectUrl.searchParams.set('amount', result.amount.toString());
      redirectUrl.searchParams.set('message', result.message);
      redirectUrl.searchParams.set(
        'signature',
        result.isValidSignature ? 'valid' : 'invalid',
      );

      return res.redirect(redirectUrl.toString());
    }
}
