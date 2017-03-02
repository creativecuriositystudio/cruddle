import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteComponent } from './components/delete';
import { FormComponent } from './components/form';
import { ListComponent } from './components/list';
import { ReadComponent } from './components/read';

/**
 * The module containing all of the Cruddle components.
 * This should be imported into your relevant application
 * modules.
 */
@NgModule({
  imports: [CommonModule],

  declarations: [
    DeleteComponent,
    FormComponent,
    ListComponent,
    ReadComponent
  ],

  exports: [
    DeleteComponent,
    FormComponent,
    ListComponent,
    ReadComponent
  ]
})
export class CruddleModule {}
