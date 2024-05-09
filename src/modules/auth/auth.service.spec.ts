import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Users } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  const mockUser: Partial<Users> = {
    name: 'Liliana Galvez',
    password: 'Lily@123',
    email: 'Galvez.Lili@gmail.com',
    isAdmin: false,
  };

  const mockJwtService = {
    sign: (payload) => jwt.sign(payload, 'mysecretkeyphrase'),
  };

  beforeEach(async () => {
    mockUsersService = {
      getUserByEmail: () => Promise.resolve(undefined),
      newUser: (user: Partial<Users>) =>
        Promise.resolve({
          ...user,
          id: '23423423sdf',
        }),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Should create an instance of authService', () => {
    expect(authService).toBeDefined();
  });

  it('Signup() creates a new user with an encripted password', async () => {
    const user = await authService.signUp(mockUser);

    expect(user).toBeDefined();
    expect(user.password).not.toEqual(mockUser.password);
  });

  it('Signup() must return error if email is already in use', async () => {
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as Users);

    try {
      await authService.signUp(mockUser as Users);
    } catch (error) {
      expect(error.message).toEqual('This email is already in use');
    }
  });

  it('Signin() must return error if password is wrong', async () => {
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as Users);

    try {
      await authService.signIn(mockUser.email, 'Lily@123');
    } catch (error) {
      expect(error.message).toEqual('Invalid user or password');
    }
  });

  it('Signin() must return error if user is not found', async () => {
    try {
      await authService.signIn(mockUser.email, 'Lily@123');
    } catch (error) {
      expect(error.message).toEqual('Invalid user or password');
    }
  });

  it('Signin() must return a message with a generated token if credentials are correct', async () => {
    const mockUserVariant = {
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10),
    };

    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserVariant as Users);

    const response = await authService.signIn(
      mockUser.email,
      mockUser.password,
    );

    expect(response).toBeDefined();
    expect(response.message).toEqual('User logged succesfully!');
    expect(response.token).toBeDefined();
  });
});
