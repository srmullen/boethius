// @flow
import { SYSTEM } from './constants';
import type { YY } from './types';

class SystemNode {
    props: {};
    type: string = SYSTEM;

    constructor (props: {}) {
        this.props = props;
    }

    set (newprops: {}) {
        this.props = Object.assign({}, this.props, newprops);
        return this;
    }

    serialize (scope: {}) {
        return Object.assign({}, scope, this.props, {type: SYSTEM});
    }

    execute (yy: YY, scope: {}) {
        yy.layout.systems.push(this.serialize(scope));
    }
}

export default SystemNode;
