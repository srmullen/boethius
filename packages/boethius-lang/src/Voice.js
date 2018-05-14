// @flow
import F from 'fraction.js';
import { last } from 'lodash';
import type { YY, LineProps } from './types';
import { CLEF } from './constants';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';
import { Node } from './interfaces/Node';
import { getTime, setTime, calculateDuration } from './time';
import { isClef, isMusic } from './utils';

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
            if (json.type === CLEF) {
                // find the line the current voice belongs to.
                const line: ?LineProps = yy.layout.lines.find(line => {
                    return line.voices.some(name => name === this.props.name);
                });
                if (line) {
                    line.clefs.push(json);
                }
            }
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

/*
 * Sets time property on all the items. Removes the items that do not belong
 * in a voice list (clefs, keys, etc.).
 */
function calculateAndSetTimes (items, offset=0) {
    return items.reduce((acc, item) => {
        const previousItem = acc[acc.length-1];

        if (previousItem) {
			setTime(item, F(getTime(previousItem)).add(calculateDuration(previousItem)).valueOf());
        } else {
			setTime(item, offset);
        }

        if (isMusic(item)) {
            return acc.concat([item]);
        } else {
            return acc;
        }
    }, []);
}

export default Voice;
