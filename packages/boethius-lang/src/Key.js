// @flow
import { KEY } from './constants';
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class Key implements Serializable {
    props: {};

    type: string = KEY;

    constructor (props: {}) {
        this.props = props;
    }

    serialize () {
        return Object.assign({}, this.props, {type: KEY});
    }
}

export default Key;
