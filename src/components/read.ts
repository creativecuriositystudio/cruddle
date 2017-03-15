import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { ReadDefinition } from '../definitions/read';

/**
 * The Cruddle read component that handles the read/view screen.
 */
@Component({
  selector: 'cruddle-read',
  template: `
    <div class="cruddle-read">
      <ng-content></ng-content>
    </div>
  `
})
export class ReadComponent {
  /** The definition of the read/view screen. */
  @Input() def: ReadDefinition<any>;

  /** The model instance data that is being read/viewed. */
  @Input() data: any;
}