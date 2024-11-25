import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  Matches, 
  MaxLength, 
  MinLength 
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {
    message: 'You must provide a valid email address.',
  })
  @Matches(/^(?!.*\+\d+)[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'The email address cannot contain a + followed by numbers.',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(32, {
    message: 'Password cannot exceed 32 characters.',
  })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Password must include uppercase, lowercase, numbers, and special characters.',
  })
  password: string;

  @IsNotEmpty({ message: 'Password confirmation is required.' })
  @Matches(/^.*$/, {
    message: 'Password confirmation must match the password.',
  })
  passwordConfirm: string;

  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  @MinLength(1, { message: 'First name cannot be empty.' })
  @MaxLength(32, { message: 'First name cannot exceed 32 characters.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  @MinLength(1, { message: 'Last name cannot be empty.' })
  @MaxLength(32, { message: 'Last name cannot exceed 32 characters.' })
  lastName: string;
}
