import { Property, Model, ModelConstructor,
         AttributeType, AssociationType } from 'modelsafe';

/**
 * A property of a model. This can be either an attribute
 * or association. It's important that both are captured,
 * since filtering and sorting by associations is
 * generally useful.
 *
 * This is actually captured by ModelSafe,
 * but we store these separately so that additional property
 * can be added manually and so that we can capture
 * extra metadata like sorting and filtering.
 */
export interface PropertyDefinition {
  /** The path of the attribute on the model. */
  path: string;

  /** The label of this property. */
  label: string;

  /** Whether the property is sortable. Defaults to false. */
  sortable?: boolean;

  /** Whether the property is filterable. Defaults to false. */
  filterable?: boolean;
}

/** The definition of an attribute, which is also a property. */
export interface AttributeDefinition extends PropertyDefinition {
  /** The attribute type. */
  type: AttributeType;
}

/** The definition of an association, which is also a property. */
export interface AssociationDefinition extends PropertyDefinition {
  /** The association type. */
  type: AssociationType;
}

/**
 * A generic action that performs some task.
 * This is generally represented as a button in the UI,
 * but it is up to the user of this library to decide
 * how they represent this.
 */
export interface ActionDefinition {
  /* The label of the action. */
  label: string;

  /**
   * The style of the action. It's up to the user of this library
   * to interpret this and display the action correctly.
   *
   * In other words, this could be any arbitrary value
   * but a good recommendation would be to have it as a list of HTML classes.
   */
  style?: string;
}

/**
 * An action that doesn't act on a specific instance,
 * but rather is global to the whole model. A
 * good example would be a create button, which
 * isn't specific to a particular instance of the model
 * but rather can create instances of the model.
 */
export interface GlobalActionDefinition extends ActionDefinition {
  /** The function to call when actioned. */
  do(): Promise<any>;
}

/**
 * An action on a specific instance of the model.
 *
 * @param T The model.
 */
export interface ContextualActionDefinition<T extends Model> extends ActionDefinition {
  /** The function to call when actioned. */
  do(ctx: T): Promise<any>;
}

/**
 * The base definition that all of the CRUDL definitions extend from.
 * This encapsulates the core pieces of data that should be available
 * across all components.
 *
 * @param T The model that this definition is for.
 */
export interface BaseDefinition<T extends Model> {
  /** The model the definition is for. */
  model: ModelConstructor<T>;

  /** The plural form of the model name, in lower camel-case. */
  plural: string;

  /** The singular form of the model name, in lower camel-case. */
  singular: string;

  /**
   * The actions that can be done on the model.
   * These is global to all instances.
   */
  actions?: GlobalActionDefinition[];

  /**
   * The contextual actions that can be done on the model.
   * These act on a specific instance.
   */
  contextualActions?: ContextualActionDefinition<T>[];

  /**
   * The attributes of the definition.
   * These are usually generated from a model but can be manually written.
   */
  attrs?: AttributeDefinition[];

  /**
   * The associations of the definition.
   * These are usually generated from a model but can be manually written.
   */
  assocs?: AssociationDefinition[];

  /**
   * The list of property paths that should be visible by default.
   * By default this shows all properties except ones that have been marked
   * hidden with the `@visible` decorator, i.e. `@visible(false)`.
   */
  visible: string[];
}
