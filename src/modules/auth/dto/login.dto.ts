import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { BCRYPT_MAX_PASSWORD_LENGTH } from '../../../common/constants/password.constants';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(BCRYPT_MAX_PASSWORD_LENGTH)
  password!: string;
}
