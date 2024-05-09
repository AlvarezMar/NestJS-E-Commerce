import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginUserDto, CreateUserDto } from 'src/dtos/users.dto';
import { ApiTags } from '@nestjs/swagger';
import { Users } from 'src/entities/users.entity';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signin')
  signIn(@Body() credentials: CreateLoginUserDto) {
    const { email, password } = credentials;
    return this.AuthService.signIn(email, password);
  }

  @Post('signup')
  signUp(@Body() user: CreateUserDto): Promise<Partial<Users>> {
    return this.AuthService.signUp(user);
  }
}
