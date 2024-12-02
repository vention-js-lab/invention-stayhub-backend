import { hash, verify } from 'argon2';

export const Hasher = {
  hashValue(value: string | Buffer) {
    return hash(value);
  },
  verifyHash(hashedText: string, value: string | Buffer) {
    return verify(hashedText, value);
  },
};
