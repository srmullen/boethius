// @flow
import { LINE } from './constants';
import type { YY } from './types';

class LineNode {

    props: {};

    type: string = LINE;

    constructor (props: {}) {
        this.props = props;
    }

    set (newprops: {}) {
        this.props = Object.assign({}, this.props, newprops);
        return this;
    }

    serialize (scope: {}) {
        return Object.assign({}, scope, this.props, {type: LINE});
    }

    execute (yy: YY, scope: {}) {
        yy.layout.lines.push(this.serialize(scope));
    }
}

export default LineNode;
