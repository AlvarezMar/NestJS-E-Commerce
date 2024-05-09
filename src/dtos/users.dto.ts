import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
  /**
   * Name must be a string with at least 3 characters.
   * @example 'Juan Carlos Alvarez'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  /**
   * Email must be a string with a valid email.
   * @example 'example@hotmail.com'
   */

  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Password must be a string with at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
   * @example '@Example1'
   */

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  /**
   * Password must be a string with at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
   * @example '@Example1'
   */

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  /**
   * Adress must be a string with at least 3 characters.
   * @example 'Example Street #123'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  /**
   * Phone must be a number.
   * @example '1234456789'
   */

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  /**
   * Country must be a string with at least 5 characters.
   * @example 'Mexico'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  /**
   * City must be a string with at least 5 characers.
   * @example 'Mexico City'
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;

  /**
   * IsAdmin must NOT be provided by the user.
   */
  @ApiProperty({ readOnly: true })
  @IsEmpty()
  isAdmin?: boolean;
}

export class CreateLoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
