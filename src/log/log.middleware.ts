import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from './log.service';
import { Endpoints } from './enums/endpoints.enum';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const originalEnd = res.end;
    const logService = this.logService;

    res.end = function (this: Response, ...args: any[]) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      logService.createLog({
        method: req.method,
        endpoint: req.originalUrl as Endpoints,
        executionTime,
        statusCode: res.statusCode,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      });
      
      return originalEnd.apply(this, args);
    };
    
    next();
  }
} 