// @flow
import { last } from 'lodash';
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';
import { Node } from './interfaces/Node';
import { calculateAndSetTimes, calculateDuration } from './time';

class Voice implements Node, Executable {
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
            yy.voices[this.props.name] = calculateAndSetTimes(list);
        } else {
            const previousItem = last(yy.voices[this.props.name]);
            const offset = calculateDuration(previousItem).add(previousItem.props.time);
            const listWithTimes = calculateAndSetTimes(list, offset.valueOf());
            yy.voices[this.props.name] = yy.voices[this.props.name].concat(listWithTimes);
        }
        return this;
    }
}

export default Voice;
