import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUsers = [
    {
      id: '1',
      name: 'User 1',
      email: 'test1@hotmail.com',
    },
    {
      id: '2',
      name: 'User 2',
      email: 'test2@hotmail.com',
    },
    {
      id: '3',
      name: 'User 3',
      email: 'test3@hotmail.com',
    },
  ];

  const mockNewUser = {
    id: '4',
    name: 'User 4',
    email: 'test4@hotmail.com',
  };

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(undefined),
    findOneBy: jest.fn().mockResolvedValue(undefined),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockImplementation(async (id, user) => {
      mockUsers[id - 1] = user;
    }),

    remove: jest.fn().mockImplementation(async (id) => {
      mockUsers.splice(id - 1, 1);
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('Should create an instance of usersService', () => {
    expect(usersService).toBeDefined();
  });

  it('getUsers() returns all users', async () => {
    const users = await usersService.getUsers();

    expect(users).toBeDefined();
    expect(users.length).toEqual(mockUsers.length);
    expect(users).toEqual(mockUsers);
  });

  it('getUserById() must return error if no user was found', async () => {
    try {
      await usersService.getUserById('1');
    } catch (error) {
      expect(error.message).toEqual('User not found');
    }
  });

  it('getUserById() must return user if found', async () => {
    mockUsersRepository.findOne = jest.fn().mockResolvedValue(mockUsers[0]);

    const user = await usersService.getUserById('1');

    expect(user).toBeDefined();
    expect(user).toEqual(mockUsers[0]);
  });

  it('updateUser() must return error if no user was found', async () => {
    try {
      await usersService.updateUser('1', mockUsers[0]);
    } catch (error) {
      expect(error.message).toEqual('User not found');
    }
  });

  it('updateUser() must return updated user', async () => {
    mockUsersRepository.findOneBy = jest
      .fn()
      .mockResolvedValueOnce(mockUsers[1])
      .mockResolvedValueOnce(mockNewUser);

    const user = await usersService.updateUser('2', mockNewUser);

    expect(user).toBeDefined();
    expect(user).toEqual(mockUsers[1]);
    expect(mockUsers[1]).toEqual(mockNewUser);
  });

  it('deleteUser() must return error if no user was found', async () => {
    try {
      await usersService.deleteUser('1');
    } catch (error) {
      expect(error.message).toEqual('User not found');
    }
  });

  it('deleteUser() must return deleted user if found', async () => {
    mockUsersRepository.findOneBy = jest.fn().mockResolvedValue(mockUsers[0]);

    const deletedUser = mockUsers[0];

    const user = await usersService.deleteUser('1');

    expect(user).toBeDefined();
    expect(user).toEqual(deletedUser);
    expect(mockUsers.length).toEqual(2);
  });
});
