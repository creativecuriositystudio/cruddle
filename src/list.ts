import { Injectable, EventEmitter } from '@angular/core';
import { Model, ModelConstructor } from 'modelsafe';
import * as _ from 'lodash';

import { ScreenState, ScreenDescriber, PropertyState } from './base';

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

  /** Emits events when the screen is refreshed. */
  refreshes: EventEmitter<T[]>;

  /**
   * Refreshes the list data on the screen using the latest list state.
   * This function should be provided by the describer.
   *
   * @returns The promise that resolves with the refreshed data.
   */
  refresh(): Promise<T[]>;

  /**
   * Clear the sorting of the list.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  clearSorting(refresh?: boolean): void;

  /**
   * Clear the filtering of the list.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  clearFiltering(refresh?: boolean): void;

  /**
   * Sort by a property with a specific order.
   *
   * @param prop The property to sort.
   * @param order The sort order. Defaults to ascending.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  sort(prop: PropertyState, order?: SortOrder, refresh?: boolean): void;

  /**
   * Add a filter to the list.
   * This will automatically refresh the list, unless asked not to.
   *
   * @param prop The property to filter by.
   * @param filter The additional filter state to use, without the property. This should contain the operator and value.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  addFilter(prop: PropertyState, filter: Partial<FilterState>, refresh?: boolean): void;

  /**
   * Remove a filter from the list.
   * This will automatically refresh the list, unless asked not to.
   *
   * Note that this will remove blanketly by a shallow equal.
   *
   * @param filter The filter state to stop filtering.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  removeFilter(filter: FilterState, refresh?: boolean): void;

  /**
   * Whether or not pagination information has been provided.
   *
   * @returns Whether pagination is enabled.
   */
  hasPaging(): boolean;

  /**
   * Move to a specific page page.
   * This will do nothing if paging information has not been provided.
   *
   * @param page The page number to navigate to. This starts from 1.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  setPage(page: number, refresh?: boolean): void;

  /**
   * Sets the number of items to display per page.
   * This will do nothing if paging information has not been provided.
   *
   * @param itemsPerPage The number of items to display on a page. Must be at least 1.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  setItemsPerPage(itemsPerPage: number, refresh?: boolean): void;

  /**
   * Set the current view mode of the list.
   *
   * @param mode The view mode ID. This should correspond to a mode
   *             ID on the list definition.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  setMode(mode: ListMode, refresh?: boolean): void;

  /**
   * Move to the first page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  firstPage(refresh?: boolean): void;

  /**
   * Move to the last page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  lastPage(refresh?: boolean): void;

  /**
   * Move to the next page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  nextPage(refresh?: boolean): void;

  /**
   * Move to the previous page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  previousPage(refresh?: boolean): void;
}

/** Describes a list screen. */
export abstract class ListDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initializes the state for the list screen described by this class. */
  state(): ListState<T> {
    let refresh = this.refresh.bind(this);

    // FIXME: The any cast here is required to temporarily get around not having a
    // refresh function on the list state at first.
    let state: ListState<T> = {
      ... super.state(),

      filters: [],
      sorting: [],
      refreshes: new EventEmitter(),

      /** Clear the sorting of the list. */
      clearSorting(refresh: boolean = true) {
        this.sorting = [];

        if (refresh) {
          this.refresh();
        }
      },

      /** Clear the filtering of the list. */
      clearFiltering(refresh: boolean = true) {
        this.filters = [];

        if (refresh) {
          this.refresh();
        }
      },

      /** Sort by a specific property with a specific order. */
      sort(prop: PropertyState, order?: SortOrder, refresh: boolean = true) {
        let sorting = _.filter(this.sorting, (sorted: SortState) => {
          return sorted.path !== prop.path;
        });

        if (!order) {
          order = SortOrder.ASC;
        }

        this.sorting = sorting.concat([{ path: prop.path, order }]);

        if (refresh) {
          this.refresh();
        }
      },

      /** Add a filter to the list. */
      addFilter(prop: PropertyState, filter: Partial<FilterState>, refresh: boolean = true) {
        this.filters.push(_.extend({ path: prop.path }, filter));

        if (refresh) {
          this.refresh();
        }
      },

      /** Remove a filter from the list. */
      removeFilter(filter: FilterState, refresh: boolean = true) {
        this.filters = _.without(this.filters, filter);

        if (refresh) {
          this.refresh();
        }
      },

      /** Whether or not pagination information has been provided. */
      hasPaging(): boolean {
        return this.paging && typeof (this.paging) === 'object';
      },

      /** Move to a specific page page. */
      setPage(page: number, refresh: boolean = true) {
        if (this.hasPaging()) {
          let paging = this.paging;

          paging.page = Math.max(Math.min(page, paging.numPages), 1);
        }

        if (refresh) {
          this.refresh();
        }
      },

      /** Sets the number of items to display per page. */
      setItemsPerPage(itemsPerPage: number, refresh: boolean = true) {
        if (this.hasPaging()) {
          let paging = this.paging;

          paging.itemsPerPage = Math.max(itemsPerPage, 1);
        }

        if (refresh) {
          this.refresh();
        }
      },

      /** Set the current view mode of the list. */
      setMode(mode: ListMode, refresh: boolean = true) {
        this.mode = mode.id;

        if (refresh) {
          this.refresh();
        }
      },

      /** Move to the first page. */
      firstPage(refresh: boolean = true) {
        if (this.hasPaging()) {
          this.setPage(1, refresh);
        }
      },

      /** Move to the last page. */
      lastPage(refresh: boolean = true) {
        if (this.hasPaging()) {
          let paging = this.paging;

          this.setPage(paging.numPages, refresh);
        }
      },

      /** Move to the next page. */
      nextPage(refresh: boolean = true) {
        if (this.hasPaging()) {
          let paging = this.paging;

          this.setPage(paging.page + 1, refresh);
        }
      },

      /** Move to the previous page. */
      previousPage(refresh: boolean = true) {
        if (this.hasPaging()) {
          let paging = this.paging;

          this.setPage(paging.page - 1, refresh);
        }
      },

      /** Refreshes the list data using the function provided by the describer. */
      async refresh(): Promise<T[]> {
        let data = await refresh(this);

        this.refreshes.emit(data);

        return data;
      }
    };

    return state;
  }

  /**
   * Refreshes the list data using a list state.
   *
   * @param state The list state.
   * @returns A promise that resolves with the new list data.
   */
  async abstract refresh(state: ListState<T>): Promise<T[]>;
}

/** The options for the default implementation of a list describer. */
export interface DefaultListOptions<T extends Model> {
  /** The refresh function to provide to the list state. */
  refresh(state: ListState<T>): Promise<T[]>;
}

/** A list describer for a model which uses default behaviour. */
export class DefaultListDescriber<T extends Model> extends ListDescriber<T> {
  /** The options for the default describer. */
  options: DefaultListOptions<T>;

  /**
   * Constructs the default list describer.
   *
   * @param model The model to generate state for.
   * @param options The default list options used to drive the default describer implementation.
   */
  constructor(model: ModelConstructor<T>, options: DefaultListOptions<T>) {
    super(model);

    this.options = options;
  }

  /** Refreshes the list data using the refresh function provided as an option. */
  async refresh(state: ListState<T>): Promise<T[]> {
    return this.options.refresh(state);
  }
}

/**
 * Generates default list describers from ModelSafe models.
 * The list describer can then be used to initialize a state for a screen
 * that behaves in a default way.
 */
@Injectable()
export class AutoListDescriber {
  /** Automatically generates a list describer for a model. */
  describe<T extends Model>(model: ModelConstructor<T>, options: DefaultListOptions<T>): DefaultListDescriber<T> {
    return new DefaultListDescriber(model, options);
  }
}
