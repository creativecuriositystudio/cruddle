import { Model } from 'modelsafe';

import { ScreenState, ScreenDescriber } from './base';

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

  /** The data of the view mode. */
  data?: any;

  /** The label of the view mode. */
  label: string;
}

/** The state of sorting a property on a list. */
export interface SortState {
  /** The property that is being sorted. */
  path: string;

  /** The sort order. */
  order: SortOrder;
}

/** The state of filtering a property on a list. */
export interface FilterState {
  /** The property path being filtered on. */
  path: string;

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

/** The state for a list screen. */
export interface ListState<T extends Model> extends ScreenState<T> {
  /** The filter state of the list. */
  filters: FilterState[];

  /** The sorting state of the list. */
  sorting: SortState[];

  /** The pagination state of the list. */
  paging?: PagingState;

  /** The current list view mode. */
  mode?: string;

  /**
   * Refreshes the list data on the screen using the latest list state.
   * This function should be provided by the describer.
   *
   * @returns The promise that resolves with the refreshed data.
  */
  refresh(): Promise<T[]>;
}

/** Describes a list screen. */
export abstract class ListDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initializes the state for the list screen described by this class. */
  state(): ListState<T> {
    // FIXME: The any cast here is required to temporarily get around not having a
    // refresh function on the list state at first.
    let state: ListState<T> = {
      ... super.state(),

      filters: [],
      sorting: []
    } as any;

    state.refresh = this.refresh.bind(this, state);

    return state;
  }

  /**
   * Refreshes the list data using a list state.
   *
   * @param state The list state.
   * @returns A promise that resolves with the new list data.
  */
  abstract refresh(state: ListState<T>): Promise<T[]>;
}
