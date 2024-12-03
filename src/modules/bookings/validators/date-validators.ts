import { time } from '#/shared/libs/time.lib';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: string) {
    const currentDate = time().toDate();
    const providedDate = time(date).toDate();

    return (
      providedDate >= currentDate ||
      (providedDate.toDateString() === currentDate.toDateString() && providedDate.getTime() >= currentDate.getTime())
    );
  }

  defaultMessage() {
    return `Start date must not be in the past.`;
  }
}

@ValidatorConstraint({ name: 'IsStartDateBeforeEndDate', async: false })
export class IsStartDateBeforeEndDate implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const object = args.object as Record<string, string>;
    const startDate = time(object.startDate);
    const endDate = time(object.endDate);

    return startDate < endDate;
  }

  defaultMessage() {
    return 'Start date must be earlier than end date.';
  }
}
