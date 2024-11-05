import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.model';
import { Endpoints } from './enums/endpoints.enum';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async createLog(logData: Partial<Log>): Promise<Log> {
    const log = this.logRepository.create(logData);
    return await this.logRepository.save(log);
  }

  async getLogs(): Promise<Log[]> {
    return await this.logRepository.find({
      order: {
        timestamp: 'DESC',
      },
    });
  }

  async getLogById(id: string): Promise<Log> {
    const log = await this.logRepository.findOneBy({ id });
    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
    return log;
  }

  async getLogsByEndpoint(endpoint: Endpoints): Promise<Log[]> {
    return await this.logRepository.find({
      where: { endpoint },
      order: {
        timestamp: 'DESC',
      },
    });
  }
} 