import { Controller, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('get-all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-one')
  findOne(@Body('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @Delete('delete')
  remove(@Body('id') id: string) {
    return this.usersService.remove(id);
  }
}