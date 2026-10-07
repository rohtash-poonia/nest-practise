import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a dummy user', () => {
    expect(service.getUser()).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    });
  });
});
