import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/**
 * A callback for saving a specific model instance.
 * This should do any validation required first and then
 * save the model instance. Because this is component is for
 * both update and create, when saving the instance
 * this function should check if the primary key is set and if so
 * update the instance, otherwise create it.
 *
 * @param T The model.
 */
export interface SaveCallback<T extends Model> {
  (instance: T, ...args: any[]): Promise<any>;
}

/**
 * The definition of a form component.
 */
export interface FormDefinition<T extends Model> extends BaseDefinition<T> {
  /** The callback for saving a new or old model instance. */
  save: SaveCallback<T>;
}