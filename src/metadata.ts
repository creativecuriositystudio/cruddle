/* tslint:disable:ban-types */
import 'reflect-metadata';

import { PropertyDescription, AttributeDescription, AssociationDescription } from './base';

/** The meta key for a model's property options. */
export const MODEL_PROP_OPTIONS_META_KEY = 'cruddle:propOptions';

/**
 * Define any property options on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property key.
 * @param options The property options.
 */
export function definePropertyOptions(ctor: object, key: string | symbol, options: Partial<PropertyDescription>) {
  options = {
    ... Reflect.getMetadata(MODEL_PROP_OPTIONS_META_KEY, ctor, key),
    ... options
  };

  Reflect.defineMetadata(MODEL_PROP_OPTIONS_META_KEY, options, ctor, key);
}

/**
 * Get the property options for a model constructor.
 *
 * @param ctor The model constructor.
 * @param key The property key.
 * @returns The property options.
 */
export function getPropertyOptions(ctor: Function, key: string | symbol): PropertyDescription {
  return {
    visible: true,
    label: key,

    ... Reflect.getMetadata(MODEL_PROP_OPTIONS_META_KEY, ctor.prototype, key)
  };
}

/**
 * Define any attribute options on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The attribute's property key.
 * @param options The attribute options.
 */
export function defineAttributeOptions(ctor: object, key: string | symbol, options: Partial<AttributeDescription>) {
  return definePropertyOptions(ctor, key, options as Partial<PropertyDescription>);
}

/**
 * Get the attribute options for a model constructor.
 *
 * @param ctor The model constructor.
 * @param key The attribute key.
 * @returns The attribute options.
 */
export function getAttributeOptions(ctor: Function, key: string | symbol): AttributeDescription {
  return getPropertyOptions(ctor, key) as AttributeDescription;
}

/**
 * Define any association options on the model constructor.
 *
 * @param ctor The model constructor.
 * @param key The association's property key.
 * @param options The attribute options.
 */
export function defineAssociationOptions(ctor: object, key: string | symbol, options: Partial<AssociationDescription>) {
  return definePropertyOptions(ctor, key, options as Partial<PropertyDescription>);
}

/**
 * Get the attribute options for a model constructor.
 *
 * @param ctor The model constructor.
 * @param key The attribute key.
 * @returns The attribute options.
 */
export function getAssociationOptions(ctor: Function, key: string | symbol): AssociationDescription {
  return getPropertyOptions(ctor, key) as AssociationDescription;
}

/**
 * A decorator for overriding attribute definition options.
 * This can be used in conjunction with the ModelSafe
 * `@attr` decorator to provide things not captured in the other
 * Cruddle decorators, like definition data.
 *
 * @param value The attribute definition options to use.
 */
export function attr(value: Partial<AttributeDescription>) {
  return (ctor: Object, key: string | symbol) => defineAttributeOptions(ctor, key, value);
}

/**
 * A decorator for overriding association definition options.
 * This can be used in conjunction with the ModelSafe
 * `@assoc` decorator to provide things not captured in the other
 * Cruddle decorators, like definition data.
 *
 * @param value The association definition options to use.
 */
export function assoc(value: Partial<AssociationDescription>) {
  return (ctor: Object, key: string | symbol) => defineAssociationOptions(ctor, key, value);
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
  return (ctor: Object, key: string | symbol) => definePropertyOptions(ctor, key, { label: value });
}

/**
 * A decorator for attribute sortability.
 * By default attributes are not sortable.
 *
 * @param value Whether the attribute is sortable.
 */
export function sortable(value: boolean) {
  return (ctor: Object, key: string | symbol) => definePropertyOptions(ctor, key, { sortable: value });
}

/**
 * A decorator for attribute filterability.
 * By default attributes are not filterable.
 *
 * @param value Whether the attribute is sortable.
 */
export function filterable(value: boolean) {
  return (ctor: Object, key: string | symbol) => definePropertyOptions(ctor, key, { filterable: value });
}

/**
 * A decorator for attribute visibility.
 * By default attributes are visibile.
 *
 * @param value Whether the attribute is visible.
 */
export function visible(value: boolean) {
  return (ctor: Object, key: string | symbol) => definePropertyOptions(ctor, key, { visible: value });
}
