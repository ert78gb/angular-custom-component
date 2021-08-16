import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, Self} from '@angular/core'
import {ControlValueAccessor, NgControl} from '@angular/forms';

import {getNextUniqueId, noop} from './utils'
import {ERROR_MESSAGES, resolveFirstError} from "./custom-error-message";

@Component({
  selector: 'app-custom-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `,
  styleUrls: ['custom-input.component.scss']
})
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
   * ```
   */
  onChange = noop
  /**
   * Internal variable of the onTouch callback function.
   * Initialised it with an empty function to avoid extra ifs.
   * If we don't initialise it we have to check the function is defined or not like
   * ```javascript
   *  if (onChange)
   *    onChange(value)
   * ```
   */
  onTouch = noop

  constructor(private _cdRef: ChangeDetectorRef,
              @Inject(ERROR_MESSAGES) private _errorMessages: any,
              @Self() public control: NgControl,
  ) {
    if (this.control)
      this.control.valueAccessor = this;
  }

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

  // End ControlValueAccessor region

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(this.value);
  }

  firstError(): string | undefined {
    return resolveFirstError(this.control?.errors, this._errorMessages)
  }
}
