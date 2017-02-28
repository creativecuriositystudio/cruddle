import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { ReadDefinition } from '../definitions/read';

@Component({
  selector: 'cruddle-read',
  template: `
    <div class="cruddle-read">
      <ng-content></ng-content>
    </div>
  `
})
export class ReadComponent {
  // FIXME: Use a generic variable here.
  // SEE: https://github.com/angular/angular/issues/11057
  @Input() def: ReadDefinition<any>;
  @Input() data: any;
}
