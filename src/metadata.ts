import 'reflect-metadata';

/** The meta key for a model property's label. */
export const MODEL_ATTR_LABEL_META_KEY = 'cruddle:label';

/** The meta key for a model property's sortable state. */
export const MODEL_ATTR_SORTABLE_META_KEY = 'cruddle:sortable';

/** The meta key for a model property's sortable state. */
export const MODEL_ATTR_FILTERABLE_META_KEY = 'cruddle:filterable';

/** The meta key for a model property's visible state. */
export const MODEL_ATTR_VISIBLE_META_KEY = 'cruddle:visible';

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
 * Define whether an property should be visible on a ModelSafe model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @param options Whether the property should be visible.
 */
export function defineVisible(ctor: Object, key: string | symbol, visible: boolean) {
  Reflect.defineMetadata(MODEL_ATTR_VISIBLE_META_KEY, visible, ctor, key);
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

/**
 * Get the visible state of an property on a ModelSafe model constructor.
 * Defaults to `true` if the visibility has not been decorated.
 *
 * @param ctor The model constructor.
 * @param key The property's property key.
 * @returns Whether the property should be visible.
 */
export function getVisible(ctor: Function, key: string | symbol): boolean {
  let visible = Reflect.getMetadata(MODEL_ATTR_VISIBLE_META_KEY, ctor.prototype, key);

  return typeof (visible) !== 'boolean' ? true : visible;
}

/**
 * A decorator for attribute labels.
 * By default attribute labels are the same as their key,
 * which isn't very user-friendly. Labels can be manually
 * provided using this decorator.
 *
 * @param value The attribute label.
 */
export function label(value: string) {
  return (ctor: Object, key: string | symbol) => defineLabel(ctor, key, value);
}

/**
 * A decorator for attribute sortability.
 * By default attributes are not sortable.
 *
 * @param value Whether the attribute is sortable.
 */
export function sortable(value: boolean) {
  return (ctor: Object, key: string | symbol) => defineSortable(ctor, key, value);
}

/**
 * A decorator for attribute filterability.
 * By default attributes are not filterable.
 *
 * @param value Whether the attribute is sortable.
 */
export function filterable(value: boolean) {
  return (ctor: Object, key: string | symbol) => defineFilterable(ctor, key, value);
}

/**
 * A decorator for attribute visibility.
 * By default attributes are visibile.
 *
 * @param value Whether the attribute is visible.
 */
export function visible(value: boolean) {
  return (ctor: Object, key: string | symbol) => defineVisible(ctor, key, value);
}
