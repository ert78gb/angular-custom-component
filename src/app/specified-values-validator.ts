import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";
import {Directive, Input} from "@angular/core";

/**
 * This is the validator function that used in the Reactive Form
 */
export const specifiedValuesValidator = (values: string[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasMatch = values.includes(control.value)
    return hasMatch
      ? null
      : {notSpecifiedValues: {values}};
  };
}

/**
 * This is the directive that used in Template driven forms
 */
@Directive({
  selector: '[appSpecifiedValues]',
  providers: [{provide: NG_VALIDATORS, useExisting: SpecifiedValuesValidatorDirective, multi: true}]
})
export class SpecifiedValuesValidatorDirective implements Validator {
  @Input('appSpecifiedValues') specifiedValues?: string[];

  validate(control: AbstractControl): ValidationErrors | null {
    return this.specifiedValues
      ? specifiedValuesValidator(this.specifiedValues)(control)
      : null;
  }
}
