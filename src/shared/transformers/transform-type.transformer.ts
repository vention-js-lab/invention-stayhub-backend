import { Transform } from 'class-transformer';

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
      const date = new Date(value);
      return date;
    },
    {
      toClassOnly: true,
    },
  );
}
