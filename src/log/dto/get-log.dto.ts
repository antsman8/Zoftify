import { IsUUID } from 'class-validator';

export class GetLogDto {
  @IsUUID()
  id: string;
} 