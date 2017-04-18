import { Injectable } from '@angular/core';
import { Model, ModelConstructor } from 'modelsafe';

import { ScreenState, ScreenDescriber } from './base';

/** The state of a delete screen. */
export interface DeleteState<T extends Model> extends ScreenState<T> {
  /**
   * Deletes a model instance using the function provided by the describer.
   *
   * @param instance The instance to delete.
   * @param options Any extra options to provide.
   * @returns A promise that resolves when the instance has been deleted.
   */
  delete(instance: T, options?: any): Promise<any>;
}

/** Describes a delete screen. */
export abstract class DeleteDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initializes the state of a delete screen from the describer. */
  state(): DeleteState<T> {
    return {
      ... super.state(),

      delete: this.delete.bind(this)
    };
  }

  /**
   * Deletes a model instance.
   *
   * @param instance The instance to delete.
   * @param options Any extra options to provide.
   * @returns A promise that resolves when the instance has been deleted.
   */
  async abstract delete(instance: T, options?: any): Promise<any>;
}

/** The options for the default implementation of a delete describer. */
export interface DefaultDeleteOptions<T extends Model> {
  /** The delete function to provide to the default describer. */
  delete(instance: T, options?: any): Promise<any>;
}

/** A delete describer for a model which uses default behaviour. */
export class DefaultDeleteDescriber<T extends Model> extends DeleteDescriber<T> {
  /** The options for the default describer. */
  options: DefaultDeleteOptions<T>;

  /**
   * Constructs the default delete describer.
   *
   * @param model The model to generate state for.
   * @param options The default delete options used to drive the default describer implementation.
   */
  constructor(model: ModelConstructor<T>, options: DefaultDeleteOptions<T>) {
    super(model);

    this.options = options;
  }

  /** Saves the form data using the save function provided as an option. */
  async delete(instance: T, options?: any): Promise<T> {
    return this.options.delete(instance, options);
  }
}

/**
 * Generates default delete describers from ModelSafe models.
 * The delete describer can then be used to initialize a state for a screen
 * that behaves in a default way.
 */
@Injectable()
export class AutoDeleteDescriber {
  /** Automatically generates a form describer for a model. */
  describe<T extends Model>(model: ModelConstructor<T>, options: DefaultDeleteOptions<T>): DefaultDeleteDescriber<T> {
    return new DefaultDeleteDescriber(model, options);
  }
}
