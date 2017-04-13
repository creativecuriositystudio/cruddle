import { Model, ModelErrors } from 'modelsafe';

import { ScreenState, ScreenDescriber } from './base';

/** The state for a form screen. */
export interface FormState<T extends Model> extends ScreenState<T> {
  errors: ModelErrors<T>;

  /**
   * Saves an instance the resolves with the updated instance using the
   * function provided by the describer.
   *
   * @param instance The instance to save.
   * @param options Any options to provide.
   * @returns A promise that resolves with the updated instance.
   */
  save(instance: T, options?: any): Promise<T>;

  /**
   * Cancels editing/creating an instance using the function provided
   * by the describer.. This is optional and might be required in some cases
   * (such as when a 'Cancel' button is required on the screen.

   */
  cancel?(instance: T): Promise<any>;
}

/** Describes a form screen, which is generally a shared create/edit screen. */
export abstract class FormDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initialize form state from this form describer. */
  state(): FormState<T> {
    return {
      ... super.state(),

      errors: {},
      save: this.save.bind(this),
      cancel: this.cancel.bind(this)
    };
  }

  /**
   * Saves a model instance using whatever backend required
   * by the user of this library. This will be automatically be provided
   * to the form state when it is constructed.
   *
   * This must be provided by a child class.
   *
   * @see state
   */
  abstract save(instance: T, options?: any): Promise<T>;

  /**
   * Cancel saving a model instance. By default this does nothing.
   * If you need the screen to have a cancel button, override
   * this function in a child class. This will automatically be provided
   * to the form state when it is constructed.
   */
  async cancel(instance:T, options?: any): Promise<any> {
    // Do nothing.
  }
}
