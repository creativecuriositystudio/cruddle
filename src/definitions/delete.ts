import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/**
 * The definition of a delete component.
 *
 * @param T The model.
 */
export interface DeleteDefinition<T extends Model> extends BaseDefinition<T> {
  /** The callback for deleting a model instance. */
  delete(instance: T, ...args: any[]): Promise<any>;
}
