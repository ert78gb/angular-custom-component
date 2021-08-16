# Angular Custom Form Component

This example project demonstrate how to create a custom form control with validation and custom validation message. Many
article on the Internet that cover only the parts of the topics. The
Angular [Forms](https://angular.io/guide/forms-overview) guide also describe very well the things, but not connect the
dots. I regularly work with colleagues or interns whose haven't worked with Angular earlier. Or they don't have deep
experience with the framework. I hope will enough to share with them in this repo in the future and they will be
familiar with Angular much faster.

If a new application is developing it follows a design system. In our example we will
use [Bootstrap](https://getbootstrap.com)
This design system describe where to put the label of the field where to so the error messages etc. If you have a small
application with few input control then maybe faster to copy/paste the components but if you have many forms worth to
create custom controls

This example shows the reactive forms and templating forms way to compare the to solutions.

## What is the difference between reactive and templating form?

The official [answer](https://angular.io/guide/forms-overview) focusing on the "scalable, reusable, and testable". I
think the answer is more simple. If you use the template option you write the logic of the form in with directives in
the `template` section of the component With reactive form we use codes to build forms and minimalise the `template`
part.

I prefer the end to end or full page testing with mocked backend instead of component testing. From this point of you I
don't see the difference between the 2 approach.

You will see the 2 method not exclude each other.

## Structure of the project

The `src/app/` folder contains the files that focus on the demonstration

- a custom control in `custom-input.component.ts`
- a custom validator in `specified-values-validator.ts`
- a reactive form that uses the custom component `reactive-form.component.ts`
- a template driven form that uses the custom component `template-form.component.ts`

## How to bind the data to a control

In the templating form we use the `([ngModel])="object.property"` syntax.

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form>
      <input name="myInput" ([ngModel])="data">
    </form>
  `
})
export class MyComponent {
  data = 'my data'
}
```

In the reactive form we use the `formControlName="controlName"` syntax.

```typescript
@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <input formControlName="myControl">
    </form>
  `
})
export class MyComponent {
  form: FormGroup

  constructor() {
    this.form = new FormGroup({
      myContron: new FormControl()
    })
  }
}
```

From the above examples when the form is simple than needed to write more code to achieve the same goal with reactive
forms. But later we will see will it change or not.

## How to create a custom form control

There are 2 simple step that we have to implement

- Visualisation. This is the template of the component
- Communication with the outer word.
  - get notification when the data of the component changed in outside of the component.
  - notify the outer word if the component changed the data. Most of the time it is a user interaction.

### Implement the visualisation

As I mentioned earlier we use Bootstap to implement more real-life component

The Angular template:

```angular2html

<div class="form-group">
  <label [for]="id">{{ label }}</label>
  <input class="form-control"
         [id]="id"
         [ngModel]="value"
         [disabled]="isDisabled"
         [placeholder]="placeholder"
         (ngModelChange)="onValueChange($event)"
         (blur)="onTouch()"
  >
  <div *ngIf="control?.errors"
       class="invalid-feedback"
  >
    {{ firstError() }}
  </div>
</div>
```

### Communicate with the external word

When creating a new control than have to implement the `ControlValueAccessor` interface. This interface is the bride
between the Angular forms binding - external word - and the custom component.

`ControlValueAccessor` has 4 methods

- `writeValue(obj: any): void` called when the Angular form write data to the component
- `registerOnChange(fn: any): void` Angular provide the callback function that have to be called when the component want
  to notify the outer word about the data is changed. We have to store it as class a property for later use.
- `registerOnTouched(fn: any): void` Angular provide the callback function that have to be called when the component
  want to notify the outer word about the user had interaction with the control. Most of the time it is when the "focus"
  leave the component. We have to store it as class a property for later use.
- `setDisabledState?(isDisabled: boolean): void` Angular notify the component to switch to enabled or disabled state. It
  is an optional method but, 99% we should implement.

Our implementation

```typescript
export class CustomInputComponent implements ControlValueAccessor {

  /**
   * Store the value in this class level variable. The process flow
   * 1. Angular calls the `writeValue` to notify the component about the value changed
   * 2. the `writeValue` method store the value in the `value` variable
   * 3. When the component is rendering read the input.value from this variable
   */
  value?: string
  /**
   * Store the disabled state in this class level variable. The process flow
   * 1. Angular calls the `setDisabledState` to notify the component about the disabled/enabled state
   * 2. the `setDisabledState` method store the value in the `isDisabled` variable
   * 3. When the component is rendering read the disabled attribute of the input control set from this variable
   */
  isDisabled = false;

  /**
   * Internal variable of the onChange callback function.
   * Initialised it with an empty function to avoid extra ifs.
   * If we don't initialise it we have to check the function is defined or not like
   * ```javascript
   *  if (onChange)
   *    onChange(value)
   * \```
   * @private
   */
  private onChange = noop;
  /**
   * Internal variable of the onTouch callback function.
   * Initialised it with an empty function to avoid extra ifs.
   * If we don't initialise it we have to check the function is defined or not like
   * ```javascript
   *  if (onChange)
   *    onChange(value)
   * \```
   * @private
   */
  private onTouch = noop

  // Start ControlValueAccessor region
  /**
   * Angular notify the component about the value is changed outside of this component
   * @param obj
   */
  writeValue(obj: any): void {
    // If the new value is same as the current value we do nothing.
    // We don't wanna re-render the component.
    // It is just performance optimalisation
    if (obj === this.value)
      return;

    // store the new value in the class level variable
    this.value = obj;
    // notify the rendering engine the component change have to re-render
    this._cdRef.markForCheck();
  }

  /**
   * Angular provide a callback function that have to be called to notify the outer word if the value of the component changed
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Angular provide a callback function that have to be called to notify the outer word if the user interacted with the component
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  /**
   * Angular notify the component about the enabled/disabled state
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }
}
```

The `ControlValueAccessor` responsible only for bi-directional Angular form binding. But many times we needed more
information to the rendering like the `label` of the data. We provide it with the `@Input()` binding
```typescript
export class CustomInputComponent implements ControlValueAccessor {
    @Input() label?: string;
    @Input() placeholder = '';
    /**
     * In Bootstrap design system we don't put the `input` control inside the `label` element.
     * For accessibility and other features we have to set the `id` attribute of the input control
     * and have to set the `for` attribute also to connect the 2 component.
     * `getNextUniqueId()` automatically generate an id the developer does not provide one
     */
  @Input() id: string = getNextUniqueId()
}
```

### Connect the Template and the ControlValueAccessor


## To support many users as possible

When you create a new application or create a component library don't forget the accessibility. 
