import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';
import { Role } from 'src/common/enums/role.enum';
import { Product } from 'src/product/schema/product.schema';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    
    @Prop({required: true})
    fullname: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop()
    shippingAddress?: string;

    @Prop()
    gender?: Gender;

    @Prop()
    role?: Role;


    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'product'}]})
    favourites: Product[];
}


export const UserSchema = SchemaFactory.createForClass(User);