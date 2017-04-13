import { Model } from 'modelsafe';

import { ScreenState, ScreenDescriber } from './base';

export interface ReadState<T extends Model> extends ScreenState<T> {}

export abstract class ReadDescriber<T extends Model> extends ScreenDescriber<T> {
  state(): ReadState<T> {
    return super.state();
  }
}
