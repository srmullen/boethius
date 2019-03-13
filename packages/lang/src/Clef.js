// @flow
import { CLEF } from './constants';
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class Clef implements Serializable {
    props: {};

    type: string = CLEF;

    constructor (props: {}) {
        this.props = props;
    }

    serialize () {
        return Object.assign({}, this.props, {type: CLEF});
    }
}

export default Clef;
