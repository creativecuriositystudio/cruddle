import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { ListDefinition } from '../definitions/list';

@Component({
  selector: 'cruddle-list',
  template: `
    <div class="cruddle-list">
      <ng-content></ng-content>
    </div>
  `
})
export class ListComponent {
  // FIXME: Use a generic variable here.
  // SEE: https://github.com/angular/angular/issues/11057
  @Input() def: ListDefinition<any>;
  @Input() data: any[];
}
