import 'reflect-metadata';

/** The meta key for a model property's label. */
export const MODEL_ATTR_LABEL_META_KEY = 'cruddle:label';

/** The meta key for a model property's sortable state. */
export const MODEL_ATTR_SORTABLE_META_KEY = 'cruddle:sortable';

/** The meta key for a model property's sortable state. */
export const MODEL_ATTR_FILTERABLE_META_KEY = 'cruddle:filterable';

/**
 * Define the label to be displayed for an property on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @param options The property label.
 */
export function defineLabel(ctor: Object, key: string | symbol, label: string) {
  Reflect.defineMetadata(MODEL_ATTR_LABEL_META_KEY, label, ctor, key);
}

/**
 * Define whether an property should be filterable on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @param options Whether the property should be filterable.
 */
export function defineFilterable(ctor: Object, key: string | symbol, filterable: boolean) {
  Reflect.defineMetadata(MODEL_ATTR_FILTERABLE_META_KEY, filterable, ctor, key);
}

/**
 * Define whether an property should be sortable on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @param options Whether the property should be sortable.
 */
export function defineSortable(ctor: Object, key: string | symbol, sortable: boolean) {
  Reflect.defineMetadata(MODEL_ATTR_SORTABLE_META_KEY, sortable, ctor, key);
}

/**
 * Get the label of an property on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @returns The label of the property.
 */
export function getLabel(ctor: Function, key: string | symbol): string {
  return Reflect.getMetadata(MODEL_ATTR_LABEL_META_KEY, ctor.prototype, key);
}

/**
 * Get the sortable state of an property on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @returns Whether the property should be sortable.
 */
export function getSortable(ctor: Function, key: string | symbol): boolean {
  return Reflect.getMetadata(MODEL_ATTR_SORTABLE_META_KEY, ctor.prototype, key);
}

/**
 * Get the filterable state of an property on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @returns Whether the property should be filterable.
 */
export function getFilterable(ctor: Function, key: string | symbol): boolean {
  return Reflect.getMetadata(MODEL_ATTR_FILTERABLE_META_KEY, ctor.prototype, key);
}
