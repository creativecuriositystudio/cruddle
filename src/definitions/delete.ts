import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/**
 * A callback for deleting a specific model instance.
 * This should do any validation if required and then delete the instance.
 *
 * @param T The model.
 */
export interface DeleteCallback<T extends Model> {
  (instance: T, ...args: any[]): Promise<any>;
}

/**
 * The definition of a delete component.
 */
export interface DeleteDefinition<T extends Model> extends BaseDefinition<T> {
  /** The callback for deleting a model instance. */
  delete: DeleteCallback<T>;
}
