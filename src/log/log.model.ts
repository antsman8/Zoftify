import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Endpoints } from './enums/endpoints.enum';

@Entity({ name: 'logs' })
export class Log {
  @ApiProperty({ example: 'uuid', description: 'Unique log identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'GET', description: 'HTTP method' })
  @Column()
  method: string;

  @ApiProperty({ 
    example: '/api/users/get-all', 
    description: 'API endpoint',
    enum: Endpoints 
  })
  @Column({
    type: 'enum',
    enum: Endpoints,
  })
  endpoint: Endpoints;

  @ApiProperty({ example: 100, description: 'Request execution time in milliseconds' })
  @Column()
  executionTime: number;

  @ApiProperty({ example: '2024-02-20T12:00:00Z', description: 'Log creation timestamp' })
  @CreateDateColumn()
  timestamp: Date;

  @ApiProperty({ example: 200, description: 'HTTP status code', required: false })
  @Column({ nullable: true })
  statusCode: number;

  @ApiProperty({ example: 'Mozilla/5.0...', description: 'User agent string', required: false })
  @Column({ nullable: true })
  userAgent: string;

  @ApiProperty({ example: '127.0.0.1', description: 'Client IP address', required: false })
  @Column({ nullable: true })
  ip: string;
} 