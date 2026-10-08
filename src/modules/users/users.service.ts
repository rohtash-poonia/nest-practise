import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  dummmyUsers = [
    {
      id: 1,
      name: 'rohtash poonia',
      email: 'rohtash.poonia@example.com',
    },
    {
      id: 2,
      name: 'DEVESH DUHAN',
      email: 'devesh.duhan@example.com',
    },
  ];
}