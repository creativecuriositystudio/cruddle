import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { DeleteDefinition } from '../definitions/delete';

@Component({
  selector: 'cruddle-delete',
  template: `
    <div class="cruddle-delete">
      <ng-content></ng-content>
    </div>
  `
})
export class DeleteComponent {
  // FIXME: Use a generic variable here.
  // SEE: https://github.com/angular/angular/issues/11057
  @Input() def: DeleteDefinition<any>;
  @Input() data: any;
}
