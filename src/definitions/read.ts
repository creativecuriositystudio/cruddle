import { Model } from 'modelsafe';

import { BaseDefinition } from './base';

/**
 * The definition of a read component.
 */
export interface ReadDefinition<T extends Model> extends BaseDefinition<T> {}
