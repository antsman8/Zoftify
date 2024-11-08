import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetLogDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Log ID (UUID)' 
  })
  @IsUUID()
  id: string;
} 