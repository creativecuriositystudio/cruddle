import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Model } from 'modelsafe';

import { BaseComponent } from './base';
import { FormDefinition, FormError, FormState } from '../definitions/form';

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

  /** The state of the form. */
  @Input() state: FormState;

  /** Emits errors during saving the instance. */
  @Output() error = new EventEmitter();

  /** Initialize the component. */
  ngOnInit() {
    this.visible = this.def.visible;
    this.state = {
      errors: {},
      error: null
    };
  }

  /**
   * Save the model instance. This should do any validation necessary and
   * create or instance the model depending on whether the instance already existed.
   *
   * If the `save` on the form definition throws a form error,
   * this will automatically populate the form state with the geneeral error message
   * and property-specific error message.
   */
  async save() {
    this.state.errors = {};
    this.state.error = null;

    try {
      this.data = await this.def.save(this.data);
    } catch (err) {
      if (err instanceof FormError) {
        this.state.errors = err.errors;
        this.state.error = err.message;
      }

      this.error.emit(err);
    }
  }

  /** Cancel/navigate away from the form screen. */
  async cancel() {
    try {
      await this.def.cancel(this.data);
    } catch (err) {
      this.error.emit(err);
    }
  }
}
