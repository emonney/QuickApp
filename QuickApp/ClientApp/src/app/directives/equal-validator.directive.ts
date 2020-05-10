// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';



@Directive({
  selector: '[appValidateEqual][formControlName],[appValidateEqual][formControl],[appValidateEqual][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
  ]
})
export class EqualValidator implements Validator {
  constructor(@Attribute('appValidateEqual') public validateEqual: string,
              @Attribute('reverse') public reverse: string) {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    const other = c.root.get(this.validateEqual);

    if (!other) {
      return null;
    }

    return this.reverse === 'true' ? this.validateReverse(c, other) : this.validateNoReverse(c, other);
  }

  private validateNoReverse(c: AbstractControl, other: AbstractControl): { [key: string]: any } {
    return other.value === c.value ? null : { validateEqual: true };
  }

  private validateReverse(c: AbstractControl, other: AbstractControl): { [key: string]: any } {
    if (c.value === other.value) {
      if (other.errors) {
        delete other.errors.validateEqual;

        if (Object.keys(other.errors).length === 0) {
          other.setErrors(null);
        }
      }
    } else {
      other.setErrors({ validateEqual: true });
    }

    return null;
  }
}
