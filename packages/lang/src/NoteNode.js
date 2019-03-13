// @flow
import { NOTE } from './constants';

class NoteNode {
    props: {};

    type: string = NOTE;

    constructor (props: {}) {
        this.props = props;
    }

    set (newprops: {}) {
        var props = Object.assign({}, this.props, newprops);
        return new NoteNode(props);
    }

    serialize (scope: {}) {
        const props = Object.assign({}, scope, this.props);
        return Object.assign({}, {type: NOTE, props});
    }
}

export default NoteNode;
