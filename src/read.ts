import { Injectable } from '@angular/core';
import { Model, ModelConstructor } from 'modelsafe';

import { ScreenState, ScreenDescriber } from './base';

/** The state of a read (view) screen. */
export interface ReadState<T extends Model> extends ScreenState<T> {}

/** Describes a read screen. */
export abstract class ReadDescriber<T extends Model> extends ScreenDescriber<T> {
  /** Initializes the state for a read screen. */
  state(): ReadState<T> {
    return super.state();
  }
}

/** A read describer for a model without any custom behaviour. */
export class DefaultReadDescriber<T extends Model> extends ReadDescriber<T> {}

/**
 * Generates default read describers from ModelSafe models.
 * The read describer can then be used to initialize a state for a screen
 * that behaves in a default way.
 */
@Injectable()
export class AutoReadDescriber {
  /** Automatically generates a read describer for a model. */
  describe<T extends Model>(model: ModelConstructor<T>): DefaultReadDescriber<T> {
    return new DefaultReadDescriber(model);
  }
}
