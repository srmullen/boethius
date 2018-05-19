// @flow
import teoria from 'teoria';
import { KEY } from './constants';
import type { YY, KeyProps } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

class Key implements Serializable {
    props: KeyProps;

    type: string = KEY;

    scale: teoria.Scale;

    constructor (props: KeyProps) {
        this.props = props;
        this.scale = teoria.scale(props.root, props.mode);
    }

    serialize () {
        return Object.assign({}, this.props, {type: KEY});
    }

    execute () {}

    /*
     * True if the given pitch class belongs to the key's scale, false otherwise.
     */
    hasPitch (pitch: string): boolean {
        return this.scale.simple().find(n => n === pitch);
    }

    /*
     * Not sure if this methods name is the best.
     * Given a pitch class returns a pitch class with the accidental from the key.
     */
    getEnharmonic (pitch: string) {
        return this.scale.simple().find(n => n[0] === pitch);
    }
}

export default Key;
