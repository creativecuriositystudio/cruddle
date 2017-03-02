import { getProperties, Model, ModelConstructor, Property, Attribute, Association } from 'modelsafe';

import { BaseDefinition, DeleteDefinition, FormDefinition,
    ListDefinition, ReadDefinition } from './definitions';

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
  protected static base<T extends Model>(model: ModelConstructor<T>, overrides: Partial<BaseDefinition<T>>): BaseDefinition<T> {
    let props = getProperties(model);
    let attrs = [];
    let assocs = [];

    for (let key of Object.keys(props)) {
      let prop = props[key] as Property<any>;
      let path = prop.compile();

      if (prop instanceof Attribute) {
        // We cast as any to get the private assoc type.
        let type = (prop as any).type;

        attrs.push({
          prop,
          path,
          type,

          label: path,
          sortable: false,
          filterable: false
        });
      }

      if (prop instanceof Association) {
        // We cast as any to get the private assoc type.
        let type = (prop as any).type;

        assocs.push({
          prop,
          path,
          type,

          label: path,
          sortable: false,
          filterable: false
        });
      }
    }

    return {
      model,
      attrs,
      assocs,

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
  static form<T extends Model>(model: ModelConstructor<T>, overrides: Partial<FormDefinition<T>>): FormDefinition<T> {
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
  static delete<T extends Model>(model: ModelConstructor<T>, overrides: Partial<DeleteDefinition<T>>): DeleteDefinition<T> {
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
  static read<T extends Model>(model: ModelConstructor<T>, overrides: Partial<ReadDefinition<T>>): ReadDefinition<T> {
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
  static list<T extends Model>(model: ModelConstructor<T>, overrides: Partial<ListDefinition<T>>): ListDefinition<T> {
    let base = Definitions.base(model, overrides as Partial<BaseDefinition<T>>);

    return {
      ... base,
      ... overrides
    } as ListDefinition<T>;
  }
}
