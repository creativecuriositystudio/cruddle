import { AttributeType, Model } from 'modelsafe';

/**
 * An attribute of a model.
 * This is actually captured by ModelSafe,
 * but we store these separately so that additional attributes
 * can be added manually and so that we can capture
 * extra metadata like sorting and filtering.
 */
export interface AttributeDefinition {
  type: AttributeType;
  label: string;
  path: string;
  sortable: boolean;
  filterable: boolean;
}

/** A callback for actioning a global action. */
export interface GlobalActionCallback {
  (): Promise<any>;
}

/** A callback for actioning a contextual action. */
export interface ContextualActionCallback<T extends Model> {
  (ctx: T): Promise<any>;
}

/**
 * A generic action that performs some task.
 * This is generally represented as a button in the UI,
 * but it is up to the user of this library to decide
 * how they represent this.
 */
export interface ActionDefinition {
  label: string;
  style: string;
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
  do: GlobalActionCallback;
}

/**
 * An action on a specific instance of the model.
 *
 * @param T THe model that this action is for.
 */
export interface ContextualActionDefinition<T extends Model> extends ActionDefinition {
  /** The function to call when actioned. */
  do: ContextualActionCallback<T>;
}

/**
 * The base definition that all of the CRUDL definitions extend from.
 * This encapsulates the core pieces of data that should be available
 * across all components.
 *
 * @param T The model that this definition is for.
 */
export interface BaseDefinition<T extends Model> {
  actions: GlobalActionDefinition[];
  contextualActions: ContextualActionDefinition<T>[];
  attrs: AttributeDefinition[];
}
