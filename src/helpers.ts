import * as _ from 'lodash';
import { pluralize, singularize } from 'inflection';
import { getProperties, getModelOptions, Model, ModelConstructor, ModelProperties,
         Property, Attribute, Association } from 'modelsafe';

import { BaseDefinition, DeleteDefinition, FormDefinition,
         ListDefinition, ReadDefinition, ListState } from './definitions';
import { getLabel, getFilterable, getSortable } from './metadata';

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

    for (let key of Object.keys(props)) {
      let prop = props[key] as Property<any>;
      let path = prop.toString();
      let label = getLabel(model, key);
      let filterable = getFilterable(model, key);
      let sortable = getSortable(model, key);

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
      singular,
      plural,
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
      visible(state: ListState, props: ModelProperties<T>): Property<any>[] {
        return _.values(props);
      },

      ... overrides
    } as ListDefinition<T>;
  }
}
