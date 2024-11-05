import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Endpoints } from './enums/endpoints.enum';

@Entity({ name: 'logs' })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  method: string;

  @Column({
    type: 'enum',
    enum: Endpoints,
  })
  endpoint: Endpoints;

  @Column()
  executionTime: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ip: string;
} 