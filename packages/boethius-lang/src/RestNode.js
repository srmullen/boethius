// @flow
import { REST } from './constants';

class RestNode {
    props: {};

    constructor (props: {}) {
        this.props = props;
    }

    set (newprops: {}) {
        var props = Object.assign({}, this.props, newprops);
        return new RestNode(props);
    }

    serialize (scope: {}) {
        const props = Object.assign({}, scope, this.props);
        return Object.assign({}, {type: REST, props});
    }
}

export default RestNode;
