import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>
      This repo demonstrate how to create a custom form control with validation
    </h1>

    <div class="container mt-5">
      <div class="row">
        <app-template-form class="col-4"></app-template-form>
        <app-reactive-form class="col-4"></app-reactive-form>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'angular-custom-component';
}
