import {InjectionToken} from '@angular/core';

export const ERROR_MESSAGES = new InjectionToken<any>('ERROR.MESSAGES');

export const template = (strings: any, ...keys: any) => {
  return ((...values: any) => {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];

    keys.forEach((key: any, i: any) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });

    return result.join('');
  });
}

export const DEFAULT_ERROR_MESSAGE = {
  required: 'Required!',
  notSpecifiedValues: template`Please select from ${'values'}`
}

export const resolveFirstError = (errors: any, messages: any): string | undefined => {
  if (!errors)
    return undefined;

  const keys = Object.keys(errors);
  const firstKey = keys[0];
  const message = messages[firstKey];

  if (!message)
    return firstKey;

  if (typeof message === 'function')
    return message(errors[firstKey])

  return message
}
