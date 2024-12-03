import { Transform } from 'class-transformer';
import { time } from '../libs/time.lib';

export function TransformToNumber() {
  return Transform(
    ({ value }) => {
      const numValue = Number(value);
      return isNaN(numValue) ? false : numValue;
    },
    {
      toClassOnly: true,
    },
  );
}

export function TransformToBoolean() {
  return Transform(({ value }) => value === 'true', {
    toClassOnly: true,
  });
}
export function TransformToDate() {
  return Transform(
    ({ value }) => {
      const date = time(value as string);
      return date;
    },
    {
      toClassOnly: true,
    },
  );
}
