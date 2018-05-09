// @flow
import type { YY } from '../types';
import { Node } from './Node';

export interface Executable {
    execute(yy: YY, scope: {}): {}
}
