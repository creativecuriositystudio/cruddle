import { Injectable } from '@angular/core';
import { Model, ModelConstructor, ModelErrors } from 'modelsafe';

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
   * by the describer. This is optional and might be required in some cases
   * (such as when a 'Cancel' button is required on the screen.
   *
   * @param instance The instance to cancel editing.
   * @returns A promise that resolves when editing is cancelled.
   */
  cancel(instance: T): Promise<any>;
}

/** Describes a form screen, which is generally a shared create/edit screen. */
export abstract class FormDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initialize form state from this form describer. */
  state(): FormState<T> {
    let save = this.save.bind(this);
    let cancel = this.cancel.bind(this);

    return {
      ... super.state(),

      errors: {},

      /** The wrapped save functionality. */
      async save(instance: T, options?: any): Promise<T> {
        return save(this, instance, options);
      },

      /** The wrapped cancel functionality. */
      async cancel(instance: T): Promise<any> {
        return cancel(this, instance);
      }
    };
  }

  /**
   * Saves a model instance using whatever backend required
   * by the user of this library. This will be automatically be provided
   * to the form state when it is constructed.
   *
   * This must be provided by a child class.
   *
   * @param state The current form screen state.
   * @param instance The model instance to save.
   * @param options Any extra options provided.
   * @returns A promise that resolves when the instance has been saved.
   */
  async abstract save(state: FormState<T>, instance: T, options?: any): Promise<T>;

  /**
   * Cancel saving a model instance. By default this does nothing.
   * If you need the screen to have a cancel button, override
   * this function in a child class. This will automatically be provided
   * to the form state when it is constructed.
   *
   * @param state The current form screen state.
   * @param instance The model instance to cancel saving.
   * @param options Any extra options provided.
   */
  async cancel(_state: FormState<T>, _instance: T): Promise<any> {
    // Do nothing.
  }
}

/** The options for the default implementation of a form describer. */
export interface DefaultFormOptions<T extends Model> {
  /** The save function to provide to the default describer. */
  save(state: FormState<T>, instance: T, options?: any): Promise<T>;

  /** The cancel function to provide to the default describer. */
  cancel?(state: FormState<T>, instance: T): Promise<any>;
}

/** A form describer for a model which uses default behaviour. */
export class DefaultFormDescriber<T extends Model> extends FormDescriber<T> {
  /** The options for the default describer. */
  options: DefaultFormOptions<T>;

  /**
   * Constructs the default form describer.
   *
   * @param model The model to generate state for.
   * @param options The default form options used to drive the default describer implementation.
   */
  constructor(model: ModelConstructor<T>, options: DefaultFormOptions<T>) {
    super(model);

    this.options = options;
  }

  /** Saves the form data using the save function provided as an option. */
  async save(state: FormState<T>, instance: T, options?: any): Promise<T> {
    return this.options.save(state, instance, options);
  }

  /** Cancels saving the form using the cancel function provided as an option. */
  async cancel(state: FormState<T>, instance: T): Promise<any> {
    if (typeof (this.options.cancel) === 'function') {
      return this.options.cancel(state, instance);
    }
  }
}

/**
 * Generates default form describers from ModelSafe models.
 * The form describer can then be used to initialize a state for a screen
 * that behaves in a default way.
 */
@Injectable()
export class AutoFormDescriber {
  /** Automatically generates a form describer for a model. */
  describe<T extends Model>(model: ModelConstructor<T>, options: DefaultFormOptions<T>): DefaultFormDescriber<T> {
    return new DefaultFormDescriber(model, options);
  }
}
