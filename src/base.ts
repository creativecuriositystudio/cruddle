import * as _ from 'lodash';
import { singularize, pluralize } from 'inflection';
import { Observable, BehaviorSubject } from 'rxjs';
import { Model, ModelConstructor, AttributeType, AssociationType, getModelOptions,
         getAttributes, getAssociations, InternalAttributeType, EnumAttributeTypeOptions } from 'modelsafe';

import { getPropertyOptions } from './metadata';

/** Describes a possible value for a property.  */
export interface PropertyValueDescription {
  /** The label of the property value. */
  label: string;

  /** The value to set the relevant property to if this value is selected. */
  value: any;
}

/** Describes a property of a model. This could be an association or attribute. */
export interface PropertyDescription {
  /** The path to the property on the model. */
  path: string;

  /** The label of the property. */
  label: string;

  /** Whether the property is sortable. */
  sortable: boolean;

  /** Whether the property is filterable. */
  filterable: boolean;

  /** Whether the property is visible by default. */
  visible: boolean;

  /** Any extra data the property has. */
  data?: any;

  /** Whether the property is read-only. */
  readOnly: boolean;

  /** The ordering of the property. Negative numbers come first when sorting the properties. */
  order: number;

  /** The possible values of a property. */
  values: PropertyValueDescription[] | Observable<PropertyValueDescription[]> | Promise<PropertyValueDescription[]>;
}

/** Describes an attribute of a model. */
export interface AttributeDescription extends PropertyDescription {
  /** The type of the attribute. */
  type: AttributeType;
}

/** All attribute descriptions of a model, mapped by path. */
export interface AttributeDescriptions {
  [key: string]: AttributeDescription;
}

/** Describes an association of a model. */
export interface AssociationDescription extends PropertyDescription {
  /** The type of the association. */
  type: AssociationType;
}

/** All association descriptions of a model, mapped by path. */
export interface AssociationDescriptions {
  [key: string]: AssociationDescription;
}

/** The general description of a screen. This is for miscellaneous description settings. */
export interface ScreenDescription {
  /** The pluralized camel-case form of the model name. */
  plural: string;

  /** The singularized camel-case form of the model name. */
  singular: string;

  /**
   * The paths of visible properties. By default this will be the list of attributes/associations
   * on the model that have been marked as visible.
   */
  visible: string[];
}

/**
 * Describes an action that can be performed on the screen that is not related
 * to a specific model instance, e.g. a 'Create New' button which might take you to a page.
 */
export interface ActionDescription<T extends Model> {
  /** The label of the action. */
  label: string;

  /** Any extra data for the action. */
  data?: any;

  /**
   * Performs the action itself.
   *
   * @param state The screen state to action with.
   * @param options Any extra options for the action.
   * @returns A promise resolving with the action result.
   */
  do(this: ActionState<T>, state: ScreenState<T>, options?: any): Promise<any>;
}

/**
 * Describe san action that can be performed on a specific model instance, for e.g.
 * a 'Delete' button that deletes a specific model instance/row.
 */
export interface ContextualActionDescription<T extends Model> extends ActionDescription<T> {
  /**
   * Performs the contextual action itself.
   *
   * @param state The screen state to action with.
   * @param instance The model instance to perform the action on.
   * @param options Any extra options for the action.
   * @returns A promise that resolves with the action result.
   */
  do(this: ContextualActionState<T>, state: ScreenState<T>, instance: T, options?: any): Promise<any>;
}

/** The state of a property to display on the screen. */
// tslint:disable-next-line:no-empty-interface
export interface PropertyState extends PropertyDescription {}

/** The state of an action on the screen. */
export interface ActionState<T extends Model> extends ActionDescription<T> {
  /** Whether the action is being performed. */
  isPerforming: boolean;
}

export interface ContextualActionState<T extends Model> extends ContextualActionDescription<T> {
  /** Whether the action is beign performed. */
  isPerforming: boolean;
}

/** The start of an alert message on the screen. */
export interface AlertState {
  /**
   * The ID of the alert. If this alert state is pushed with unique mode on,
   * only one alert with the same ID can exist at once.
   */
  id: string;

  /** The message of the alert. This might be HTML or plain-text depending on your implementation. */
  message: string;

  /** Any extra data for the alert. */
  data?: any;
}

/** The state of the screen. This is shared across all action specific states. */
export interface ScreenState<T extends Model> extends ScreenDescription {
  /** The alerts on the screen. */
  alerts: AlertState[];

  /** The properties to display on the screen. */
  props: Observable<PropertyState[]>;

  /** The properties subject that emits the observable `props` attribute. */
  propsSubject: BehaviorSubject<PropertyState[]>;

  /** The actions on the screen. */
  actions: ActionState<T>[];

  /** The contextual actions (instance-acting) on the screen. */
  contextualActions: ContextualActionState<T>[];

  /**
   * Set the properties that are visible on the screen.
   * This will automatically re-emit the properties list (`props`)
   * with the new list of visible properties with their relative ordering.
   *
   * @param paths The list of property paths that should be visible.
   */
  setVisible(paths: string[]): void;
}

/**
 * The base screen describer class.
 *
 * A screen describer provides all of the descriptions
 * of how a screen look and function. The screen
 * describer generates this directly off a ModelSafe
 * model by default (but the descriptions can be overridden
 * to come from a static/hard-coded source if you don't want
 * to use ModelSafe for a specific screen). The describer
 * is then used to generate a screen state, which actually
 * specifies what should be displayed and allows
 * for interactions with the screen.
 */
export abstract class ScreenDescriber<T extends Model> {
  /** The ModelSafe model this screen is for. */
  protected model: ModelConstructor<T>;

  /** Construct a screen describer. */
  constructor(model: ModelConstructor<T>) {
    this.model = model;
  }

  /** Instantiates a state from the screen described by this class. */
  state(): ScreenState<T> {
    let screen = this.getScreen();
    let visible = screen.visible;
    let descriptions = _
        .values<PropertyDescription>(this.getAttributes())
        .concat(_.values<PropertyDescription>(this.getAssociations()));

    let refreshProps = (visible: string[]) => {
      return descriptions
        .filter(desc => visible.indexOf(desc.path) !== -1)
        .sort((a, b) => {
          return (typeof (a.order) === 'number' ? a.order : 0) - (typeof (b.order) === 'number' ? b.order : 0);
        });
    };

    let propsSubject = new BehaviorSubject(refreshProps(visible));

    return _.clone({
      alerts: [],
      plural: screen.plural,
      singular: screen.singular,
      visible: screen.visible,
      props: propsSubject.asObservable(),
      propsSubject,

      actions: this.getActions().map((action: ActionDescription<T>): ActionState<T> => {
        let state = _.clone(action);

        state.do = state.do.bind(state);

        return state as ActionState<T>;
      }),

      contextualActions: this.getContextualActions().map((action: ContextualActionDescription<T>): ContextualActionState<T> => {
        let state = _.clone(action);

        state.do = state.do.bind(state);

        return state as ContextualActionState<T>;
      }),

      /** Set the properties that are visible. */
      setVisible(paths: string[]) {
        this.visible = paths;
        this.propsSubject.next(refreshProps(paths));
      }
    });
  }

  /** Get the misc. screen description. */
  getScreen(): ScreenDescription {
    let name = getModelOptions(this.model).name;
    let descriptions = _
      .values<PropertyDescription>(this.getAttributes())
      .concat(_.values<PropertyDescription>(this.getAssociations()));

    return {
      plural: pluralize(_.camelCase(name)),
      singular: singularize(_.camelCase(name)),
      visible: descriptions
        .filter(desc => desc.visible)
        .map(desc => desc.path)
    };
  }

  /** Get the attributes for this screen, which by default come from the model. */
  getAttributes(): AttributeDescriptions {
    let attrs = getAttributes(this.model);
    let mappedAttrs = {};

    for (let key of Object.keys(attrs)) {
      let attr = attrs[key];
      let propOptions = getPropertyOptions(this.model, key);
      let attrOptions = {
        path: key,
        type: attr.type,
        readOnly: attr.readOnly,

        ... propOptions
      };

      // Check if the internal attribute type is ENUM, if so pre-populate values with relevant enum variants
      // (if no values have been provided manually).
      if (!_.isArray(attrOptions.values) && attr.type.type === InternalAttributeType.ENUM) {
        attrOptions.values = (attr.type.options as EnumAttributeTypeOptions).values.map((v: any) => {
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

  /** Get the associations for this screen, which by default come from the model. */
  getAssociations(): AssociationDescriptions {
    let assocs = getAssociations(this.model);
    let mappedAssocs = {};

    for (let key of Object.keys(assocs)) {
      let assoc = assocs[key];
      let propOptions = getPropertyOptions(this.model, key);
      let assocOptions = {
        path: key,
        type: assoc.type,
        readOnly: assoc.readOnly,

        ... propOptions
      };

      mappedAssocs[key] = assocOptions;
    }

    return mappedAssocs;
  }

  /** Get the actions for this screen. */
  getActions(): ActionDescription<T>[] {
    return [];
  }

  /** Get the contextual actions for this screen. */
  getContextualActions(): ContextualActionDescription<T>[] {
    return [];
  }
}
