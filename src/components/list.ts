import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Model, ModelProperties, Property, getProperties } from 'modelsafe';

import { ListDefinition, ListState, ListMode,
         FilterState, SortOrder } from '../definitions/list';

/**
 * The Cruddle list component that handles the list screen.
 */
@Component({
  selector: 'cruddle-list',
  template: `
    <div class="cruddle-list">
      <ng-content></ng-content>
    </div>
  `
})
export class ListComponent {
  /** The definition of the list. */
  @Input() def: ListDefinition<any>;

  /** The model instance data that is being listed. */
  @Input() data: any[];

  /** The state of the list. */
  @Input() state: ListState;

  /** Emits errors during refreshing the list. */
  @Output() error = new EventEmitter();

  /** Initialize the component with defaults. */
  ngOnInit() {
    this.state = {
      filters: [],
      sorting: [],
      visible: [],

      ... this.state
    };

    this.refreshVisibility();
  }

  /**
   * Clear the sorting of the list.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  clearSorting(refresh: boolean = true) {
    this.state.sorting = [];
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Clear the filtering of the list.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  clearFiltering(refresh: boolean = true) {
    this.state.filters = [];
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Sort by a specific property with a specific order.
   *
   * @param map A function that takes the model's properties and returns
   *            the property to sort by.
   * @param order The sort order. Defaults to ascending.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  sort(map: (props: ModelProperties<any>) => Property<any>, order?: SortOrder, refresh: boolean = true) {
    let props = getProperties(this.def.model);
    let prop = map(props);
    let sorting = _.filter(this.state.sorting, s => s.prop.toString() !== prop.toString());

    if (!order) {
      order = SortOrder.ASC;
    }

    this.state.sorting = sorting.concat([{ prop, order }]);
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Add a filter to the list.
   * This will automatically refresh the list,
   * unless asked not to.
   *
   * @param map A function that takes the model's properties and returns
   *             the property to filter by.
   * @param filter The additional filter state to use, without the property. This should contain the operator and value.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  addFilter(map: (props: ModelProperties<any>) => Property<any>, filter?: Partial<FilterState>, refresh: boolean = true) {
    let props = getProperties(this.def.model);
    let prop = map(props);

    this.state.filters.push({ prop, ... filter as FilterState });
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Remove a filter from the list.
   * This will automatically refresh the list,
   * unless asked not to.
   *
   * Note that this will remove blanketly by the a shallow equal.
   *
   * @param filter The filter state to stop filtering.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  removeFilter(filter: FilterState, refresh: boolean = true) {
    this.state.filters = _.without(this.state.filters, filter);
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Whether or not pagination information has been provided.
   *
   * @returns Whether pagination is enabled.
   */
  hasPaging(): boolean {
    return this.state.paging && typeof (this.state.paging) === 'object';
  }

  /**
   * Move to a specific page page.
   * This will do nothing if paging information has not been provided.
   *
   * @param page The page number to navigate to. This starts from 1.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  setPage(page: number, refresh: boolean = true) {
    if (this.hasPaging()) {
      let paging = this.state.paging;

      paging.page = Math.max(Math.min(page, paging.numPages), 1);
    }

    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Set the current view mode of the list.
   *
   * @param mode The view mode ID. This should correspond to a mode
   *             ID on the list definition.
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  setMode(mode: ListMode, refresh: boolean = true) {
    this.state.mode = mode.id;
    this.refreshVisibility();

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Move to the next page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  nextPage(refresh: boolean = true) {
    if (this.hasPaging()) {
      let paging = this.state.paging;

      this.setPage(paging.page + 1, refresh);
    }
  }

  /**
   * Move to the previous page.
   * This will do nothing if paging information has not been provided.
   *
   * @param refresh Whether or not to refresh the list after. Defaults to true.
   */
  previousPage(refresh: boolean = true) {
    if (this.hasPaging()) {
      let paging = this.state.paging;

      this.setPage(paging.page - 1, refresh);
    }
  }

  /**
   * Refresh the instance data being displayed using
   * the existing filters, sorting and paging.
   *
   * This will also automatically output any errors to the error output,
   * to allow for users of the library to handle data refresh errors
   * (whether it be from an API or local storage) appropiately.
   */
  refresh() {
    let self = this;

    this.def
      .refresh(this.state)
      .then(data => {
        self.data = data;
      })
      .catch(err => {
        self.error.emit(err);
      });
  }

  /**
   * Refresh the visible properties on the screen
   * from the list state.
   */
  refreshVisibility() {
    this.state.visible = this.def.visible(this.state, getProperties(this.def.model));
  }
}
