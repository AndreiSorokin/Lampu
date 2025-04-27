import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPastDate', async: false })
export class IsPastDateConstraint implements ValidatorConstraintInterface {
  validate(date: string | undefined) {
    if (!date) return true;
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate < today && !isNaN(inputDate.getTime());
  }

  defaultMessage() {
    return 'Date of birth must be in the past';
  }
}
