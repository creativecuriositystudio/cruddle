import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoFormDescriber } from './form';
import { AutoReadDescriber } from './read';
import { AutoDeleteDescriber } from './delete';
import { AutoListDescriber } from './list';

/**
 * The module containing all of the Cruddle components.
 * This should be imported into your relevant application
 * modules.
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    AutoFormDescriber,
    AutoReadDescriber,
    AutoDeleteDescriber,
    AutoListDescriber
  ]
})
export class CruddleModule {}
