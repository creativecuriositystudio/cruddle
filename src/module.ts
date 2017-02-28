import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteComponent } from './components/delete';
import { FormComponent } from './components/form';
import { ListComponent } from './components/list';
import { ReadComponent } from './components/read';

@NgModule({
  imports: [CommonModule],

  declarations: [
    DeleteComponent,
    FormComponent,
    ListComponent,
    ReadComponent
  ]
})
export class CruddleModule {}
