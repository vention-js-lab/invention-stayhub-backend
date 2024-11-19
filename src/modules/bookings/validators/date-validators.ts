import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: string) {
    const currentDate = new Date();
    const providedDate = new Date(date);

    return (
      providedDate >= currentDate ||
      (providedDate.toDateString() === currentDate.toDateString() &&
        providedDate.getTime() >= currentDate.getTime())
    );
  }

  defaultMessage() {
    return `Start date must not be in the past.`;
  }
}

@ValidatorConstraint({ name: 'IsStartDateBeforeEndDate', async: false })
export class IsStartDateBeforeEndDate implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const startDate = new Date(object.startDate);
    const endDate = new Date(object.endDate);

    return startDate < endDate;
  }

  defaultMessage() {
    return 'Start date must be earlier than end date.';
  }
}
