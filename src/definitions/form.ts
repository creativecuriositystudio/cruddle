import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/** A map of property path to an array of errors. */
export interface FormErrors {
  [path: string]: string[];
}

/**
 * An error relating to a form and its data, i.e. validation errors.
 *
 * The `save` promise should reject with this
 * error if there are errors with the form data.
 * This will then be populated on the form component in order to
 *
 * @see FormDefinition
 */
export class FormError extends Error {
  /** The form data errors. */
  errors?: FormErrors;

  /**
   * Construct a validation error.
   *
   * @param ctor The model constructor this error is for.
   */
  constructor(message: string, errors?: FormErrors) {
    super(message);

    this.name = 'FormError';
    this.stack = new Error().stack;
    this.errors = errors;

    // Required in order for error instances to be able to use instanceof.
    // SEE: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md
    (this as any).__proto__ = FormError.prototype;
  }
}

/** The state of a form component. */
export interface FormState {
  /** Any form data errors */
  errors: FormErrors;

  /** A general error message, if there's an error. */
  error?: string;
}

/**
 * The definition of a form component.
 *
 * @param T The model.
 */
export interface FormDefinition<T extends Model> extends BaseDefinition<T> {
  /**
   * The callback for saving a new or old model instance.
   *
   * This should do any validation required first and then
   * save the model instance. Because this is component is for
   * both update and create, when saving the instance
   * this function should check if the primary key is set and if so
   * update the instance, otherwise create it.
   *
   * The promise should return the data to be updated on the screen,
   * i.e. the fresh data received from saving the instance.
   */
  save(instance: T, ...args: any[]): Promise<T>;

  /**
   * The callback for cancelling/navigating away from the form.
   * This is optional and should be used for form screens that
   * have cancel actions.
   */
  cancel?(instance: T): Promise<any>;
}
