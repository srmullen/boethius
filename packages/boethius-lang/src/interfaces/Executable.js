// @flow
import type { YY } from '../types';

export interface Executable {
    execute(yy: YY, scope: {}): {}
}
