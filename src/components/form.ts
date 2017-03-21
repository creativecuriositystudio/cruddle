import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Model } from 'modelsafe';

import { BaseComponent } from './base';
import { FormDefinition } from '../definitions/form';

/**
 * The Cruddle form component that handles the create/update screen functionality.
 */
@Component({
  selector: 'cruddle-form',
  template: `
    <div class="cruddle-form">
      <ng-content></ng-content>
    </div>
  `
})
export class FormComponent extends BaseComponent implements OnInit {
  /** The definition of the form screen. */
  @Input() def: FormDefinition<any>;

  /**
   * The model instance being edited or created.
   * In this case of creation, this could be an empty object.
   */
  @Input() data: any;

  /** Emits errors during saving the instance. */
  @Output() error = new EventEmitter();

  /** Initialize the component. */
  ngOnInit() {
    this.visible = this.def.visible;
  }
  /**
   * Save the model instance. This should do any validation necessary and
   * create or instance the model depending on whether the instance already existed.
   */
  save() {
    let self = this;

    this.def.save(this.data)
      .catch(err => {
        self.error.emit(err);
      });
  }
}
