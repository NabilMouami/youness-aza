import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.create(createUserDto);
  }
  @ApiSecurity('JWT-auth')
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.userService.findUserById(id);
  }
  @ApiSecurity('JWT-auth')
  @Get()
  findAll(@Req() req) {
    return this.userService.findAll();
  }
  @ApiSecurity('JWT-auth')
  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.userService.updateUser(id, createUserDto);
  }
  @ApiSecurity('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(+id);
  }
}
