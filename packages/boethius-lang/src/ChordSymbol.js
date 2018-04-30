// @flow
import { CHORDSYMBOL } from './constants';
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class ChordSymbol implements Executable, Serializable {
    props: {};

    constructor (props: {}) {
        this.props = props;
    }

    serialize () {
        return Object.assign({}, {type: CHORDSYMBOL, props: this.props});
    }

    execute (yy: YY) {
        yy.chordSymbols.push(this.serialize());
        return this;
    }
}

export default ChordSymbol;
