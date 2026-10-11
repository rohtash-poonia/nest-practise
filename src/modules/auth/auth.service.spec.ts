import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const userCreate = vi.fn();
  const service = new AuthService({
    user: { create: userCreate },
  } as never);

  beforeEach(() => {
    userCreate.mockReset();
  });

  it('creates a normalized user without returning the password hash', async () => {
    const user = {
      id: 'user-id',
      email: 'person@example.com',
      createdAt: new Date(),
    };
    userCreate.mockResolvedValue(user);

    await expect(
      service.register(' Person@Example.com ', 'a-secure-password'),
    ).resolves.toEqual(user);

    const createArgs = userCreate.mock.calls[0][0];
    expect(createArgs.data.email).toBe('person@example.com');
    expect(createArgs.data.passwordHash).toMatch(/^scrypt\$[a-f0-9]+\$[a-f0-9]+$/);
    expect(createArgs.data.passwordHash).not.toContain('a-secure-password');
    expect(createArgs.select).toEqual({
      id: true,
      email: true,
      createdAt: true,
    });
  });

  it('rejects invalid input before accessing the database', async () => {
    await expect(service.register('not-an-email', 'password123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.register('person@example.com', 'short')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(userCreate).not.toHaveBeenCalled();
  });

  it('returns a conflict when the email is already registered', async () => {
    userCreate.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.register('person@example.com', 'a-secure-password'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
