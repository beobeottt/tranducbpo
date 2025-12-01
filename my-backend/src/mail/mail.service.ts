import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private fromEmail?: string;

  constructor() {
    this.fromEmail = process.env.GMAIL_USER || process.env.EMAIL_USER || '';
    const pass = process.env.GMAIL_PASS || process.env.EMAIL_PASS || '';

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.fromEmail,
        pass,
      },
    });
  }

  async sendPasswordEmail(to: string, password: string, name?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your auto-generated password',
      text: `Hello ${name || 'User'},\n\nHere is your auto-generated password: ${password}\n\nPlease log in and change it as soon as possible.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderConfirmationEmail(
    to: string,
    payload: {
      order: { _id: string; totalPrice: number; payableAmount: number; items: any[] };
      shippingAddress?: {
        fullName?: string;
        phone?: string;
        addressLine?: string;
        ward?: string;
        district?: string;
        city?: string;
      };
      user?: { fullname?: string };
    },
  ) {
    if (!this.fromEmail || !to) return;

    // TỰ ÉP _id SANG STRING — FIX LỖI unknown
    const order = {
      ...payload.order,
      _id: String(payload.order._id),
    };

    const shippingAddress = payload.shippingAddress;
    const user = payload.user;

    const addressText = shippingAddress
      ? `${shippingAddress.addressLine || ''}${
          shippingAddress.ward ? ', ' + shippingAddress.ward : ''
        }${shippingAddress.district ? ', ' + shippingAddress.district : ''}${
          shippingAddress.city ? ', ' + shippingAddress.city : ''
        }`
      : 'Chưa cung cấp';

    const itemsHtml = (order.items || [])
      .map(
        (item) =>
          `<tr>
            <td style="padding:4px 8px;border:1px solid #eee;">${item.productName}</td>
            <td style="padding:4px 8px;border:1px solid #eee;">${item.quantity}</td>
            <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${(
              item.price || 0
            ).toLocaleString('vi-VN')}₫</td>
          </tr>`,
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <h2>Xin chào ${user?.fullname || 'Quý khách'},</h2>
        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là thông tin đơn hàng:</p>
        <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
        <p><strong>Tổng tiền:</strong> ${(
          order.payableAmount ?? order.totalPrice
        ).toLocaleString('vi-VN')}₫</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${addressText}</p>

        <table style="border-collapse:collapse;width:100%;margin-top:12px;">
          <thead>
            <tr>
              <th style="padding:6px 8px;border:1px solid #eee;text-align:left;">Sản phẩm</th>
              <th style="padding:6px 8px;border:1px solid #eee;">SL</th>
              <th style="padding:6px 8px;border:1px solid #eee;text-align:right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:16px;">Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
        <p>Trân trọng,<br/>Đội ngũ Tranducbpo</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.fromEmail,
      to,
      subject: `Xác nhận đơn hàng #${order._id}`,
      html,
    });
  }
}
