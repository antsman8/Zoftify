import { IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id: string;

  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password?: string;
}