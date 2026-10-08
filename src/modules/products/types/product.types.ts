import type { Request, Response } from 'express';

export interface GetProductsByIdRequest extends Request {
  body: { id: string };
}

export interface productType  {
id: string;
name: string;
price: number;
}