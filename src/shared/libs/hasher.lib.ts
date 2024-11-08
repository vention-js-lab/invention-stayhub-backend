import { hash, verify } from 'argon2';

export const Hasher = {
  hashValue: async (value: string | Buffer) => {
    return hash(value);
  },
  verifyHash: async (hash: string, value: string | Buffer) => {
    return verify(hash, value);
  },
};
