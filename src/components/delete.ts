import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { DeleteDefinition } from '../definitions/delete';

/**
 * The Cruddle delete component that handles delete screen functionality.
 */
@Component({
  selector: 'cruddle-delete',
  template: `
    <div class="cruddle-delete">
      <ng-content></ng-content>
    </div>
  `
})
export class DeleteComponent {
  /** The definition of the delete screen. */
  @Input() def: DeleteDefinition<any>;

  /** The model instance that's possibly being deleted. */
  @Input() data: any;
}
