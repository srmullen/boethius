// @flow
import { Serializable } from './interfaces/Serializable';
import { Stringable } from './interfaces/Stringable';

class Keyword implements Serializable, Stringable {

    value: string;

    constructor (value: string) {
        this.value = value;
    }

    toString () {
        return this.value
    }

    serialize () {
        return this.value;
    }
}

export default Keyword;
