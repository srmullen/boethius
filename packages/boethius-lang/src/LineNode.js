import { LINE } from './constants';

function LineNode (props) {
    this.props = props;
}

LineNode.prototype.type = LINE;

LineNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
};

LineNode.prototype.serialize = function (scope) {
    const props = Object.assign({}, scope, this.props);
    return Object.assign({}, {type: LINE, props});
}

LineNode.prototype.toJSON = function () {
    return Object.assign({}, this.props, {type: LINE});
}

export default LineNode;
