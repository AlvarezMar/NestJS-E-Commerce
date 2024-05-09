import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/users.dto';
import { Users } from '../../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async getUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<Partial<Users>[]> {
    const users = await this.usersRepository.find();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    return usersWithoutPassword.slice(start, end);
  }

  async getUserById(id: string): Promise<Partial<Users>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, isAdmin, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ email });
  }

  async newUser(user: Partial<CreateUserDto>): Promise<Partial<Users>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser)
      throw new HttpException('Email is already taken', HttpStatus.CONFLICT);

    const newUser = await this.usersRepository.save(user);

    const { password, confirmPassword, isAdmin, ...SecureUser } = newUser;
    return SecureUser;
  }

  async updateUser(id: string, user: Partial<Users>): Promise<Partial<Users>> {
    const oldUser = await this.usersRepository.findOneBy({ id });

    if (!oldUser) throw new NotFoundException('User not found');

    await this.usersRepository.update(id, user);

    const newUser = await this.usersRepository.findOneBy({ id });

    const { password, isAdmin, ...SecureUser } = newUser;
    return SecureUser;
  }

  async deleteUser(id: string): Promise<Partial<Users>> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    this.usersRepository.remove(user);

    const { password, isAdmin, ...SecureUser } = user;
    return SecureUser;
  }
}
