import { Model } from 'modelsafe';

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
  abstract delete(instance: T, options?: any): Promise<any>;
}
