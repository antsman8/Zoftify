import { IsEnum } from 'class-validator';
import { Endpoints } from '../enums/endpoints.enum';

export class GetLogsByEndpointDto {
  @IsEnum(Endpoints)
  endpoint: Endpoints;
} 