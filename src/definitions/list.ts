import * as _ from 'lodash';
import { Model, ModelProperties, Property } from 'modelsafe';

import { BaseDefinition } from './base';

/** The order that a property can be sorted by. */
export enum SortOrder {
  ASC,
  DESC
}

/** An ascending sort. */
export const ASC = SortOrder.ASC;

/** A descending sort. */
export const DESC = SortOrder.DESC;

/** A view mode for the list. */
export interface ListMode {
  /**
   * The ID of the view mode.
   * This is what is actually stored on the list state.
   */
  id: string;

  /** The style of the view mode. */
  style?: string;

  /** The label of the view mode. */
  label: string;
}

/** The state of sorting a property on a list. */
export interface SortState {
  /** The property that is being sorted. */
  prop: Property<any>;

  /** The sort order. */
  order: SortOrder;
}

/** The state of filtering a property on a list. */
export interface FilterState {
  /** The property being filtered on. */
  prop: Property<any>;

  /**
   * The operator being used to filter by.
   * This can be any arbitrary string and
   * it's up to the user of this library to figure
   * out how to filter by this operator.
   */
  operator: string;

  /** The value being filtered by. */
  value: any;
}

/** The state of a list's pagination. */
export interface PagingState {
  /** The current page being viewed. This is not zero-indexed (i.e. it starts from 1). */
  page: number;

  /** The number of pages. */
  numPages: number;

  /** The number of items. */
  numItems: number;

  /** The items per page. */
  itemsPerPage: number;
}

/** The total state of the list. */
export interface ListState {
  /** The filter state of the list. */
  filters: FilterState[];

  /** The sorting state of the list. */
  sorting: SortState[];

  /** The pagination state of the list. */
  paging?: PagingState;

  /**
   * Properties of the relevant model that have been
   * selected to be visible. If the list definition
   * has no custom `visible` function, this will default
   * to all fields.
   */
  visible: Property<any>[];

  /** The current list view mode. */
  mode?: string;
}

/**
 * The definition of a list component.
 *
 * @param T The model
 */
export interface ListDefinition<T extends Model> extends BaseDefinition<T> {
  /** The list view modes. */
  modes: ListMode[];

  /** The callback for refreshing the list data from the current list state. */
  refresh(state: ListState): Promise<T[]>;

  /**
   * Select the properties that should be visible on the list
   * based off the list state. This is automatically called whenever
   * the list state changes.
   */
  visible?(state: ListState, props: ModelProperties<T>): [Property<any>];
}
