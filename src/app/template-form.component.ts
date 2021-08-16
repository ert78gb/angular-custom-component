import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'app-template-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit()">
      <fieldset>
        <legend>Template Form</legend>
        <app-custom-input [(ngModel)]="data.property"
                          name="property"
                          label='Type a fruit'
                          required
                          [appSpecifiedValues]="specifiedValues"
        ></app-custom-input>

        <div class="mt-2">
          <button type="submit"
                  class="btn btn-primary"
                  [disabled]="form.invalid">Submit
          </button>
        </div>
      </fieldset>
    </form>
  `
})
export class TemplateFormComponent {
  specifiedValues = ['apple', 'banana', 'orange']

  data = {
    property: 'apple'
  }

  onSubmit(): void {
    alert('Form data' + JSON.stringify(this.data))
  }
}
