import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  /** Emits errors during deleting the instance. */
  @Output() error = new EventEmitter();

  /** Proceed with deleting the instance. */
  delete() {
    let self = this;

    this.def.delete(this.data)
      .catch(err => {
        self.error.emit(err);
      });
  }
}
