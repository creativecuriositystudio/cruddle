import * as _ from 'lodash';
import { Model, Property } from 'modelsafe';

import { BaseDefinition } from './base';

/** The order that a property can be sorted by. */
export enum SortOrder {
  ASCENDING,
  DESCENDING
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
  /** The current page being viewed. */
  page: number;

  /** The number of pages. */
  numPages: number;

  /** The number of items. */
  numItems: number;

  /** The items per page. */
  itemsPerPage: number;
}

/**
 * A callback that refreshes the list data using
 * the current filters, sorting and pagination.
 *
 * @param T The model
 */
export interface RefreshCallback<T extends Model> {
  (filters: FilterState[], sorting: SortState[], paging: PagingState): Promise<T[]>;
}

/**
 * The definition of a list component.
 *
 * @param T The model
 */
export interface ListDefinition<T extends Model> extends BaseDefinition<T> {
  /* The callback for refreshing the list data. */
  refresh: RefreshCallback<T>;
}
