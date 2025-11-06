import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CartItem } from 'src/cart/schema/cart-item.schema';


@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService)
    {

    }

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
}
