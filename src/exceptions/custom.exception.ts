import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        statusCode,
        message,
        error: HttpStatus[statusCode],
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
} 