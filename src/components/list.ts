import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Model, ModelProperties, Property, getProperties } from 'modelsafe';

import { ListDefinition, SortState, FilterState,
         PagingState, SortOrder } from '../definitions/list';

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

  /** Any sorting to apply to the list. */
  @Input() sorting: SortState[];

  /** Any filters to apply to the list. */
  @Input() filters: FilterState[];

  /** The pagination state for the list. */
  @Input() paging: PagingState;

  /** Emits errors during refreshing the list. */
  @Output() error = new EventEmitter();

  /**
   * Clear the sorting of the list.
   *
   * @param refresh Whether or not to refresh the lsit after. Defaults to true.
   */
  clearSorting(refresh: boolean = true) {
    this.sorting = [];

    if (refresh) {
      this.refresh();
    }
  }

  /**
   * Clear the filtering of the list.
   *
   * @param refresh Whether or not to refresh the lsit after. Defaults to true.
   */
  clearFiltering(refresh: boolean = true) {
    this.filters = [];

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
   * @param refresh Whether or not to refresh the lsit after. Defaults to true.
   */
  sort(map: (props: ModelProperties<any>) => Property<any>, order?: SortOrder, refresh: boolean  = true) {
    let props = getProperties(this.def.model);
    let prop = map(props);
    let sorting = _.filter(this.sorting, s => s.prop.compile() !== prop.compile());

    if (!order) {
      order = SortOrder.ASCENDING;
    }

    this.sorting.push({ prop, order });

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

    this.filters.push({ prop, ... filter as FilterState });

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
    this.filters = _.without(this.filters, filter);

    if (refresh) {
      this.refresh();
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
      .refresh(this.filters, this.sorting, this.paging)
      .then(data => {
        self.data = data;
      })
      .catch(err => {
        self.error.emit(err);
      });
  }
}
