import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LogService } from './log.service';
import { GetLogDto } from './dto/get-log.dto';
import { GetLogsByEndpointDto } from './dto/get-logs-by-endpoint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Log } from './log.model';

@ApiTags('Logs')
@Controller('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('get-all')
  @ApiOperation({ summary: 'Get all logs' })
  @ApiResponse({
    status: 200,
    description: 'Return all logs',
    type: [Log],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getLogs() {
    return this.logService.getLogs();
  }

  @Post('get-one')
  @ApiOperation({ summary: 'Get log by ID' })
  @ApiBody({ type: GetLogDto })
  @ApiResponse({
    status: 200,
    description: 'Return the log',
    type: Log,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Log not found' })
  getLogById(@Body() getLogDto: GetLogDto) {
    return this.logService.getLogById(getLogDto.id);
  }

  @Post('endpoint')
  @ApiOperation({ summary: 'Get logs by endpoint' })
  @ApiBody({ type: GetLogsByEndpointDto })
  @ApiResponse({
    status: 200,
    description: 'Return logs for specific endpoint',
    type: [Log],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getLogsByEndpoint(@Body() getLogsByEndpointDto: GetLogsByEndpointDto) {
    return this.logService.getLogsByEndpoint(getLogsByEndpointDto.endpoint);
  }
} 