import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {CustomInputComponent} from "./custom-input.component";
import {ReactiveFormComponent} from "./reactive-form.component";
import {TemplateFormComponent} from "./template-form.component";
import {DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES} from "./custom-error-message";
import {SpecifiedValuesValidatorDirective} from "./specified-values-validator";

@NgModule({
  declarations: [
    AppComponent,
    SpecifiedValuesValidatorDirective,
    CustomInputComponent,
    ReactiveFormComponent,
    TemplateFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: ERROR_MESSAGES, useValue: DEFAULT_ERROR_MESSAGE}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
