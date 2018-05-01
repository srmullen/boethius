// @flow
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class Voice implements Executable {
    props: {name: string};
    children: Array<Serializable>;

    constructor (props: {name: string}, children: Array<Serializable>) {
        this.props = props;
        this.children = children;
    }

    execute (yy: YY, scope: {}) {
        const list = this.children.reduce((acc, item) => {
            const json = item.serialize();
            return acc.concat(json);
        }, []);
        if (!yy.voices[this.props.name]) {
            // create array for voice items
            yy.voices[this.props.name] = list;
        } else {
            yy.voices[this.props.name] = yy.voices[this.props.name].concat(list);
        }
        return this;
    }
}

export default Voice;
