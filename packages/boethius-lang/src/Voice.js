// @flow
import F from 'fraction.js';
import { last } from 'lodash';
import type { YY, LineProps } from './types';
import Layout from './Layout';
import { CLEF } from './constants';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';
import { Node } from './interfaces/Node';
import { getTime, setTime, calculateDuration } from './time';
import { isClef, isKeySignature, isMusic } from './utils';

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
            const [voice, layoutItems] = calculateAndSetTimes(list);
            this.addItemToLayout(yy.layout, layoutItems);
            yy.voices[this.props.name] = voice;
        } else {
            const previousItem = last(yy.voices[this.props.name]);
            const offset = calculateDuration(previousItem).add(previousItem.props.time);
            const [voice, layout] = calculateAndSetTimes(list, offset.valueOf());
            yy.voices[this.props.name] = yy.voices[this.props.name].concat(voice);
        }
        return this;
    }

    addItemToLayout (layout: Layout, items: Array<any>) {
        items.forEach(item => {
            if (isClef(item)) {
                // find the line the current voice belongs to.
                const line: ?LineProps = layout.lines.find(line => {
                    return line.voices.some(name => name === this.props.name);
                });
                if (line) {
                    line.clefs.push(item);
                }
            } else if (isKeySignature(item)) {
                // find the line the current voice belongs to.
                const line: ?LineProps = layout.lines.find(line => {
                    return line.voices.some(name => name === this.props.name);
                });
                if (line) {
                    line.keys.push(item);
                }
            }
        });
    }
}

/*
 * Sets time property on all the items. Removes the items that do not belong
 * in a voice list (clefs, keys, etc.).
 */
function calculateAndSetTimes (items, offset=0) {
    const voiceItems = [];
    const layoutItems = [];

    for (let i = 0; i < items.length; i++) {
        const previousItem = items[i-1];
        const item = items[i];

        if (previousItem) {
			setTime(item, F(getTime(previousItem)).add(calculateDuration(previousItem)).valueOf());
        } else {
			setTime(item, offset);
        }

        if (isMusic(item)) {
            voiceItems.push(item);
        } else {
            layoutItems.push(item);
        }
    }
    return [voiceItems, layoutItems];
}

export default Voice;
