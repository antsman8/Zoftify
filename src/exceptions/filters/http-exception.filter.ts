import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from '../interfaces/error-response.interface';
import { LogService } from '../../log/log.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse: IErrorResponse = {
      statusCode: status,
      message,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Логируем ошибку
    this.logError(errorResponse, exception);

    response.status(status).json(errorResponse);
  }

  private logError(errorResponse: IErrorResponse, exception: Error): void {
    const errorLog = {
      ...errorResponse,
      stack: exception.stack,
    };

    // Для критических ошибок используем console.error
    if (errorResponse.statusCode >= 500) {
      console.error(JSON.stringify(errorLog, null, 2));
    } else {
      // Для остальных ошибок используем обычный лог
      console.log(JSON.stringify(errorLog, null, 2));
    }
  }
} 