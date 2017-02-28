import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/**
 * The definition of a list component.
 */
export interface ListDefinition<T extends Model> extends BaseDefinition<T> {}
