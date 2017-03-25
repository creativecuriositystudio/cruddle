import * as _ from 'lodash';
import { pluralize, singularize } from 'inflection';
import { getProperties, getModelOptions, Model, ModelConstructor, ModelProperties,
         Property, Attribute, Association } from 'modelsafe';

import { BaseDefinition, DeleteDefinition, FormDefinition,
         ListDefinition, ReadDefinition, ListState } from './definitions';
import { getPropertyOptions } from './metadata';

/**
 * A set of helpers for generating the CRUDL definitions
 * from ModelSafe models.
 */
export class Definitions {
  /**
   * Generate a base definition from a model.
   *
   * @param model The model.
   * @param overrides Any static overrides to the definition that gets generated.
   */
  protected static base<T extends Model>(model: ModelConstructor<T>, overrides?: Partial<BaseDefinition<T>>): BaseDefinition<T> {
    let options = getModelOptions(model);
    let singular = singularize(_.camelCase(options.name));
    let plural = pluralize(_.camelCase(options.name));
    let props = getProperties(model);
    let attrs = [];
    let assocs = [];
    let visible = [];

    for (let key of Object.keys(props)) {
      let prop = props[key] as Property<any>;
      let propOptions = getPropertyOptions(model, key);
      let path = prop.toString();

      if (propOptions.visible) {
        visible.push(path);
      }

      if (prop instanceof Attribute) {
        // FIXME: We cast as any to get the private assoc type.
        let type = (prop as any).type;

        attrs.push({
          path,
          type,

          ... propOptions
        });
      }

      if (prop instanceof Association) {
        // FIXME: We cast as any to get the private assoc type.
        let type = (prop as any).type;

        assocs.push({
          path,
          type,

          ... propOptions
        });
      }
    }

    return {
      model,
      singular,
      plural,
      attrs,
      assocs,
      visible,

      actions: [],
      contextualActions: [],

      ... overrides
    };
  }

  /**
   * Generate a form definition from a model.
   *
   * @param model The model.
   * @param overrides Any static overrides to the definition that gets generated.
   * @returns The generated definition.
   */
  static form<T extends Model>(model: ModelConstructor<T>, overrides?: Partial<FormDefinition<T>>): FormDefinition<T> {
    let base = Definitions.base(model, overrides as Partial<BaseDefinition<T>>);

    return {
      ... base,
      ... overrides
    } as FormDefinition<T>;
  }

  /**
   * Generate a delete definition from a model.
   *
   * @param model The model.
   * @param overrides Any static overrides to the definition that gets generated.
   * @returns The generated definition.
   */
  static delete<T extends Model>(model: ModelConstructor<T>, overrides?: Partial<DeleteDefinition<T>>): DeleteDefinition<T> {
    let base = Definitions.base(model, overrides as Partial<BaseDefinition<T>>);

    return {
      ... base,
      ... overrides
    } as DeleteDefinition<T>;
  }

  /**
   * Generate a read definition from a model.
   *
   * @param model The model.
   * @param overrides Any static overrides to the definition that gets generated.
   * @returns The generated definition.
   */
  static read<T extends Model>(model: ModelConstructor<T>, overrides?: Partial<ReadDefinition<T>>): ReadDefinition<T> {
    let base = Definitions.base(model, overrides as Partial<BaseDefinition<T>>);

    return {
      ... base,
      ... overrides
    } as ReadDefinition<T>;
  }

  /**
   * Generate a list definition from a model.
   *
   * @param model The model.
   * @param overrides Any static overrides to the definition that gets generated.
   * @returns The generated definition.
   */
  static list<T extends Model>(model: ModelConstructor<T>, overrides?: Partial<ListDefinition<T>>): ListDefinition<T> {
    let base = Definitions.base(model, overrides as Partial<BaseDefinition<T>>);

    return {
      ... base,

      modes: [],

      ... overrides
    } as ListDefinition<T>;
  }
}
