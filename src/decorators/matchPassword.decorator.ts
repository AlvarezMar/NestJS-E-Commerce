import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(password: string, validationArguments: ValidationArguments) {
    if (
      password !==
      (validationArguments.object as any)[validationArguments.constraints[0]]
    )
      return false;
    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return 'Passwords do not Match.';
  }
}
