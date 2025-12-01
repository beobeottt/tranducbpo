import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { CartItem, CartItemDocument } from 'src/cart/schema/cart-item.schema';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createPayment(method: string, items: CartItem[]): Promise<Payment> {
    // Lưu cart items vào collection CartItem
    const createdItems = await this.cartItemModel.insertMany(items);

    // Tạo payment
    const newPayment = new this.paymentModel({
      method,
      items: createdItems.map((i) => i._id),
    });

    return newPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('items').exec();
  }

  createVNPayPayment(params: {
    amount: number;
    orderDescription?: string;
    bankCode?: string;
    locale?: string;
    ipAddr?: string;
  }): { paymentUrl: string; orderId: string } {
    const tmnCode = this.configService.get<string>('VNPAY_TMNCODE');
    const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpUrl =
      this.configService.get<string>('VNPAY_URL') ||
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl =
      this.configService.get<string>('VNPAY_RETURN_URL') ||
      'http://localhost:3000/payment/vnpay/return';

    if (!tmnCode || !secretKey) {
      throw new BadRequestException('VNPay chưa được cấu hình đầy đủ.');
    }

    const orderId = this.generateOrderId();
    const createDate = this.formatDate(new Date());

    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: params.locale || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: params.orderDescription || `Thanh toán đơn hàng #${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(params.amount * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: params.ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    if (params.bankCode) {
      vnpParams['vnp_BankCode'] = params.bankCode;
    }

    const sortedParams = this.sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signature;

    const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;

    return { paymentUrl, orderId };
  }

  verifyVNPayReturn(query: Record<string, string>) {
    const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET');
    if (!secretKey) {
      throw new BadRequestException('VNPay chưa được cấu hình đầy đủ.');
    }

    const vnpParams = { ...query };
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValidSignature = secureHash === checkSum;
    const responseCode = vnpParams['vnp_ResponseCode'];
    const transactionStatus = vnpParams['vnp_TransactionStatus'];
    const isSuccess =
      isValidSignature && responseCode === '00' && transactionStatus === '00';

    return {
      isValidSignature,
      isSuccess,
      orderId: vnpParams['vnp_TxnRef'],
      amount: vnpParams['vnp_Amount'] ? Number(vnpParams['vnp_Amount']) / 100 : 0,
      message: isSuccess
        ? 'Thanh toán VNPay thành công.'
        : responseCode === '24'
        ? 'Giao dịch bị hủy bởi người dùng.'
        : 'Thanh toán VNPay thất bại.',
      raw: vnpParams,
    };
  }

  private sortObject(
    obj: Record<string, string | number>,
  ): Record<string, string> {
    const sorted: Record<string, string> = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = String(obj[key]).trim();
      });
    return sorted;
  }

  private formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  private generateOrderId() {
    const date = new Date();
    return `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${Math.floor(
      Math.random() * 1000,
    )}`;
  }
}
