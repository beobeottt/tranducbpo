import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
import { Role } from "src/common/enums/role.enum";

export class LoginDto
{
    @IsEmail({}, {message: 'Email không hợp lệ'})
    email: string;


    @IsString()
    @IsNotEmpty({message: 'Password không bỏ trống'})
    password: string;
}

export class RegisterDto{
    @IsEmail({}, {message: 'Email không hợp lệ'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'fill di thang lol'})
    fullname: string;

    @IsString()
    @IsNotEmpty({message: 'Password không được bỏ trống'})
    password: string;

    @IsString()
    shippingAddress: string;

    @IsOptional()
    gender: Gender;

    @IsOptional()
    role: Role;
}

export class AutoRegisterDto {
    @IsEmail({}, {message: 'Email not ok'})
    @IsNotEmpty()
    email: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
