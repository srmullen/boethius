// @flow
import { PAGE } from './constants';
import type { YY } from './types';

class PageNode {
    props: {};

    constructor (props: {}) {
        this.props = props;
    }

    set (newprops: {}) {
        this.props = Object.assign({}, this.props, newprops);
        return this;
    }

    serialize (scope: {}) {
        return Object.assign({}, scope, this.props, {type: PAGE});
    }

    execute (yy: YY, scope: {}) {
        yy.layout.pages.push(this.serialize(scope));
    }
}

export default PageNode;
