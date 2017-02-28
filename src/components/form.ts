import { Component, Input } from '@angular/core';
import { Model } from 'modelsafe';

import { FormDefinition } from '../definitions/form';

@Component({
  selector: 'cruddle-form',
  template: `
    <div class="cruddle-form">
      <ng-content></ng-content>
    </div>
  `
})
export class FormComponent {
  // FIXME: Use a generic variable here.
  // SEE: https://github.com/angular/angular/issues/11057
  @Input() def: FormDefinition<any>;
  @Input() data: any;
}
