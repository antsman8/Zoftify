import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'uuid', description: 'User ID' })
  @IsString({ message: 'ID must be a string' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'User name', required: false })
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email', required: false })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({ example: 'password123', description: 'User password', required: false })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}