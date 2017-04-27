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

  /**
   * Cancels deleting a model instance using the function provided by the describer.
   *
   * @param instance The instance to cancel deleting for.
   * @returns A promise that resolves when the delete has been cancelled.
   */
  cancel(instance: T): Promise<any>;
}

/** Describes a delete screen. */
export abstract class DeleteDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initializes the state of a delete screen from the describer. */
  state(): DeleteState<T> {
    let del = this.delete.bind(this);
    let cancel = this.cancel.bind(this);

    return {
      ... super.state(),

      /** The wrapped delete functionality. */
      async delete(instance: T, options?: any): Promise<any> {
        return del(this, instance, options);
      },

      /** The wrapped cancel functionality. */
      async cancel(instance: T): Promise<any> {
        return cancel(this, instance);
      }
    };
  }

  /**
   * Deletes a model instance.
   *
   * @param state The current delete screen state.
   * @param instance The instance to delete.
   * @param options Any extra options to provide.
   * @returns A promise that resolves when the instance has been deleted.
   */
  async abstract delete(state: DeleteState<T>, instance: T, options?: any): Promise<any>;

  /**
   * Cancels deleting a model instance.
   *
   * @param state The current delete screen state.
   * @param instance The instance to cancel deleting for.
   * @returns A promise that resolves when the delete has been cancelled.
   */
  async cancel(_state: DeleteState<T>, _instance_: T): Promise<any> {
    // Do nothing.
  }
}

/** The options for the default implementation of a delete describer. */
export interface DefaultDeleteOptions<T extends Model> {
  /** The delete function to provide to the default describer. */
  delete(state: DeleteState<T>, instance: T, options?: any): Promise<any>;

  /** The cancel function to provide to the default describer. */
  cancel?(state: DeleteState<T>, instance: T): Promise<any>;
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

  /** Deletes the instance using the delete function provided as an option. */
  async delete(state: DeleteState<T>, instance: T, options?: any): Promise<any> {
    return this.options.delete(state, instance, options);
  }

  /** Cancels deleting the instance using the cancel function provided as an option. */
  async cancel(state: DeleteState<T>, instance: T): Promise<any> {
    if (typeof (this.options.cancel) === 'function') {
      return this.options.cancel(state, instance);
    }
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
