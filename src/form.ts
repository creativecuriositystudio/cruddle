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
  async abstract save(instance: T, options?: any): Promise<T>;

  /**
   * Cancel saving a model instance. By default this does nothing.
   * If you need the screen to have a cancel button, override
   * this function in a child class. This will automatically be provided
   * to the form state when it is constructed.
   */
  async cancel(_instance: T): Promise<any> {
    // Do nothing.
  }
}

/** The options for the default implementation of a form describer. */
export interface DefaultFormOptions<T extends Model> {
  /** The save function to provide to the default describer. */
  save(instance: T, options?: any): Promise<T>;

  /** The cancel function to provide to the default describer. */
  cancel?(instance: T, options?: any): Promise<any>;
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
  async save(instance: T, options?: any): Promise<T> {
    return this.options.save(instance, options);
  }

  /** Cancels saving the form using the cancel function provided as an option. */
  async cancel(instance: T, options?: any): Promise<any> {
    if (this.options.cancel) {
      return this.options.cancel(instance, options);
    }

    // Do nothing.
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
