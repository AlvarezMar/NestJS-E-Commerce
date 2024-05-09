import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/entities/users.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/config/roles.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Partial<Users>[]> {
    return this.UsersService.getUsers(Number(page), Number(limit));
  }

  @Get(':id')
  getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Partial<Users> | string> {
    return this.UsersService.getUserById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: Partial<Users>,
  ): Promise<Partial<Users>> {
    return this.UsersService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<Partial<Users>> {
    return this.UsersService.deleteUser(id);
  }
}
