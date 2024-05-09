import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new BadRequestException('Invalid user or password');

    const validpassword = await bcrypt.compare(password, user.password);

    if (!validpassword)
      throw new BadRequestException('Invalid user or password');

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      message: 'User logged succesfully!',
    };
  }

  async signUp(user: Partial<Users>): Promise<Partial<Users>> {
    const { email, password } = user;

    const foundUser = await this.usersService.getUserByEmail(email);

    if (foundUser)
      throw new BadRequestException('This email is already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.usersService.newUser({
      ...user,
      password: hashedPassword,
    });
  }
}
