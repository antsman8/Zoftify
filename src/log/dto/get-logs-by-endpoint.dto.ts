import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Endpoints } from '../enums/endpoints.enum';

export class GetLogsByEndpointDto {
  @ApiProperty({ 
    enum: Endpoints,
    example: '/api/users/get-all',
    description: 'API endpoint to filter logs' 
  })
  @IsEnum(Endpoints)
  endpoint: Endpoints;
} 