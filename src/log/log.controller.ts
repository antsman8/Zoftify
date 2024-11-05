import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogService } from './log.service';
import { GetLogDto } from './dto/get-log.dto';
import { GetLogsByEndpointDto } from './dto/get-logs-by-endpoint.dto';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  getLogs() {
    return this.logService.getLogs();
  }

  @Post('get-one')
  getLogById(@Body() getLogDto: GetLogDto) {
    return this.logService.getLogById(getLogDto.id);
  }

  @Post('endpoint')
  getLogsByEndpoint(@Body() getLogsByEndpointDto: GetLogsByEndpointDto) {
    return this.logService.getLogsByEndpoint(getLogsByEndpointDto.endpoint);
  }
} 