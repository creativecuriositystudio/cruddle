import * as _ from 'lodash';
import { pluralize, singularize } from 'inflection';
import { getProperties, getModelOptions, Model, ModelConstructor, ModelProperties, EnumAttributeTypeOptions,
         Property, Attribute, Association, InternalAttributeType, getAttributes, getAssociations } from 'modelsafe';

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
    let attrs = getAttributes(model);
    let assocs = getAssociations(model);
    let singular = singularize(_.camelCase(options.name));
    let plural = pluralize(_.camelCase(options.name));
    let visible = [];
    let mappedAttrs = [];
    let mappedAssocs = [];

    for (let key of Object.keys(attrs)) {
      let attr = attrs[key];
      let propOptions = getPropertyOptions(model, key);

      if (propOptions.visible) {
        visible.push(key);
      }

      let attrOptions = {
        path: key,
        type: attr.type,
        readOnly: attr.readOnly,

        ... propOptions
      };

      // Check if the internal attribute type is ENUM, if so pre-populate values with relevant enum variants.
      if (attr.type.type === InternalAttributeType.ENUM) {
        attrOptions.values = (<EnumAttributeTypeOptions> attr.type.options).values.map((v: any) => {
          return {
            label: v,
            value: v
          };
        });
      }

      mappedAttrs.push(attrOptions);
    }

    for (let key of Object.keys(assocs)) {
      let assoc = assocs[key];
      let propOptions = getPropertyOptions(model, key);

      if (propOptions.visible) {
        visible.push(key);
      }

      let assocOptions = {
        path: key,
        type: assoc.type,
        readOnly: assoc.readOnly,

        ... propOptions
      };

      mappedAssocs.push(assocOptions);
    }

    return {
      model,
      singular,
      plural,
      attrs: mappedAttrs,
      assocs: mappedAssocs,
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
