import { Input } from '@angular/core';

/** The base component, which all screen-specific components extend from. */
export class BaseComponent {
  /**
   * The list of property paths to be visible on the screen.
   * If not provided, this defaults to the default list of visible properties
   * in the definition.
   */
  @Input() visible: string[];
}
