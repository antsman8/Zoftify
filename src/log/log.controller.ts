import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { GetLogDto } from './dto/get-log.dto';
import { GetLogsByEndpointDto } from './dto/get-logs-by-endpoint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  getLogs() {
    return this.logService.getLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-one')
  getLogById(@Body() getLogDto: GetLogDto) {
    return this.logService.getLogById(getLogDto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('endpoint')
  getLogsByEndpoint(@Body() getLogsByEndpointDto: GetLogsByEndpointDto) {
    return this.logService.getLogsByEndpoint(getLogsByEndpointDto.endpoint);
  }
} 