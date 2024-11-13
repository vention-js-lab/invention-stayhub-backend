import { RequestAccount } from './request-account.type';

declare module 'express' {
  export interface Request {
    user?: RequestAccount;
  }
}
