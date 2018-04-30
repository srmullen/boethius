// @flow
import { TIMESIG } from './constants';
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class TimeSignature implements Executable, Serializable {
    props: {};

    constructor (props: {}) {
        this.props = props;
    }

    serialize () {
        return Object.assign({}, this.props, {type: TIMESIG});
    }

    execute (yy: YY, scope: {}) {
        yy.layout.timeSignatures.push(this.serialize());
        return this;
    }
}

export default TimeSignature;
