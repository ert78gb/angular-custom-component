import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {specifiedValuesValidator} from "./specified-values-validator";

@Component({
  selector: 'app-reactive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <fieldset>
        <legend>Rective Form</legend>
        <app-custom-input label='Type a fruit'
                          formControlName="property"
        ></app-custom-input>

        <div class="mt-2">
          <button type="submit"
                  class="btn btn-primary"
                  [disabled]="form.invalid"
          >
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  `
})
export class ReactiveFormComponent {
  data = {
    property: 'apple'
  }

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      property: new FormControl(undefined, [
        Validators.required,
        specifiedValuesValidator(['apple', 'banana', 'orange'])
      ])
    })

    this.form.setValue(this.data)
  }

  onSubmit(): void {
    alert('Form data' + JSON.stringify(this.form.getRawValue()))
  }
}
