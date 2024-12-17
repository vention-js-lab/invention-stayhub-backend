import { time } from '../libs/time.lib';

export function readableDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(time(date).valueOf());
}
