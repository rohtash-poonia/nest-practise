import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { createUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    usersService = { createUser: vi.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a user with the supplied transactionId and utr', async () => {
    const user = { id: 'user-id', transactionId: 'transaction-id', utr: 'utr' };
    usersService.createUser.mockResolvedValue(user);

    await expect(
      controller.createRecord({ transactionId: 'transaction-id', utr: 'utr' }),
    ).resolves.toBe(user);
    expect(usersService.createUser).toHaveBeenCalledWith(
      'transaction-id',
      'utr',
    );
  });
});
