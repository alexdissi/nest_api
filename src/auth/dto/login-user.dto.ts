import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsEmail({}, {
    message: 'You must provide a valid email address.',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(32, {
    message: 'Password cannot exceed 32 characters.',
  })
  password: string;
}