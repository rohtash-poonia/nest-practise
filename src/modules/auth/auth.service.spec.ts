import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const userFindFirst = vi.fn();
  const userCreate = vi.fn();
  const service = new AuthService(
    {
      user: { findFirst: userFindFirst, create: userCreate },
    } as never,
    {} as never,
  );

  beforeEach(() => {
    userFindFirst.mockReset();
    userCreate.mockReset();
    userFindFirst.mockResolvedValue(null);
  });

  it('creates a user with a hashed password and does not return the hash', async () => {
    const dto = {
      username: 'person',
      firstname: 'Test',
      lastname: 'User',
      email: 'person@example.com',
      password: 'a-secure-password',
    };
    const user = {
      id: 'user-id',
      username: dto.username,
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: 'person@example.com',
      createdAt: new Date(),
    };
    userCreate.mockResolvedValue(user);

    await expect(service.register(dto)).resolves.toEqual({
      message: 'User registered successfully',
      user,
    });

    const createArgs = userCreate.mock.calls[0][0];
    expect(createArgs.data).toMatchObject({
      username: dto.username,
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
    });
    await expect(
      bcrypt.compare(dto.password, createArgs.data.passwordHash),
    ).resolves.toBe(true);
    expect(createArgs.select).toEqual({
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      createdAt: true,
    });
  });

  it('rejects invalid input before accessing the database', async () => {
    await expect(
      service.register({
        username: '',
        firstname: 'Test',
        lastname: 'User',
        email: 'person@example.com',
        password: 'a-secure-password',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(userFindFirst).not.toHaveBeenCalled();
    expect(userCreate).not.toHaveBeenCalled();
  });

  it('returns a conflict when the email or username is already registered', async () => {
    userFindFirst.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.register({
        username: 'person',
        firstname: 'Test',
        lastname: 'User',
        email: 'person@example.com',
        password: 'a-secure-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(userCreate).not.toHaveBeenCalled();
  });
});
