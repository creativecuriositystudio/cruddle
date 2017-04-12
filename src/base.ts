import { Observable } from 'rxjs';
import { Model, ModelConstructor, AttributeType, AssociationType,
         getAttributes, getAssociations } from 'modelsafe';

import { getPropertyOptions } from './metadata';

export interface PropertyValueDescription {
  label: string;
  value: any;
}

export interface PropertyDescription {
  path: string;
  label: string;
  sortable: string;
  filterable: string;
  visible: string;
  data?: any;
  readOnly: boolean;
  values: PropertyValueDescription[] | Observable<PropertyValueDescription[]> | Promise<PropertyValueDescription[]>;
}

export interface AttributeDescription extends PropertyDescription {
  type: AttributeType;
}

export type AttributeDescriptions = { [key: string]: AttributeDescription };

export interface AssociationDescription extends PropertyDescription {
  type: AssociationType;
}

export type AssociationDescriptions = { [key: string]: AssociationDescription };

export interface ScreenDescription {
  plural: string;
  singular: string;
}

export interface ActionDescription {
  label: string;
  data?: any;

  do(options?: any): Promise<any>;
}

export interface ContextualActionDescription<T extends Model> extends ActionDescription {
  do(instance: T, options?: any): Promise<any>;
}

export interface PropertyState extends PropertyDescription {}

export interface ActionState extends ActionDescription {
  isSubmitting: boolean;
}

export interface ContextualActionState<T extends Model> extends ContextualActionDescription<T> {
  isSubmitting: boolean;
}

export interface BaseState<T extends Model> extends ScreenDescription {
  props: PropertyState[];
  actions: ActionState[];
  contextualActions: ContextualActionState<T>[];
}

export abstract class ScreenDescriber<T extends Model> {
  protected model: ModelConstructor<T>;

  constructor(model: ModelConstructor<T>) {
    this.model = model;
  }

  abstract state(): BaseState<T>;

  getAttributes(): AttributeDescriptions {
    let attrs = getAttributes(this.model);
    let mappedAttrs = {};

    for (let key of Object.keys(attrs)) {
      let attr = attrs[key];
      let propOptions = getPropertyOptions(this.model, key);

      if (propOptions.visible) {
        visible.push(key);
      }

      let attrOptions = {
        path: key,
        type: attr.type,
        readOnly: attr.readOnly,

        ... propOptions
      };

      // Check if the internal attribute type is ENUM, if so pre-populate values with relevant enum variants
      // (if no values have been provided manually).
      if (!_.isArray(attrOptions.values) && attr.type.type === InternalAttributeType.ENUM) {
        attrOptions.values = (<EnumAttributeTypeOptions> attr.type.options).values.map((v: any) => {
          return {
            label: v,
            value: v
          };
        });
      }

      mappedAttrs[key] = attrOptions;
    }

    return mappedAttrs;
  }

  getAssociations(): AssociationDescriptions {

  }

  getActions(): ActionDescription[] {
    return [];
  }

  getContextualActions(): ContextualActionDescription<T>[] {
    return [];
  }
}
