// @flow
import { CHORD } from './constants';
import NoteNode from './NoteNode';
import { Serializable } from './interfaces/Serializable';

class ChordNode implements Serializable {
    props: {};

    children: Array<NoteNode>;

    type: string = CHORD;

    constructor (props: {}, children: Array<NoteNode>) {
        this.props = props;
        this.children = children;
    }

    set (newprops: {}) {
        const props = Object.assign({}, this.props, newprops);
        const children = this.children.map(function (child) {return child.set(newprops)});
        return new ChordNode(props, children);
    };

    serialize (scope: {}) {
        const props = Object.assign({}, scope, this.props);
        const children: Array<mixed> = this.children.map(child => child.serialize(scope));
        return Object.assign({}, {type: CHORD, props, children});
    }
}

export default ChordNode;
