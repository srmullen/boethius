// @flow
import type { YY } from './types';
import { Executable } from './interfaces/Executable';
import { Serializable } from './interfaces/Serializable';

type ChildType = Executable & Serializable;

class ScopeNode {
    props: {};
    children: Array<ChildType>

    constructor (props: {}, children: Array<ChildType>) {
        this.props = props;
        this.children = children;
    }

    set (newprops: {}) {
        const props = Object.assign({}, this.props, newprops);
        return new ScopeNode(props, this.children);
    }

    serialize (scope: {} = {}) {
        const props = Object.assign({}, scope, this.props);
        return this.children.reduce((acc, item) => {
            const json = item.serialize(props);
            return acc.concat(json);
        }, []);
    }

    execute (yy: YY, scope: {}) {
        this.children.map(child => {
            return child.execute(yy, this.props);
        });
        return this;
    }
}

export default ScopeNode;
