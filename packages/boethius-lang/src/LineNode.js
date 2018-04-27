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
    return Object.assign({}, scope, this.props, {type: LINE});
}

LineNode.prototype.execute = function (yy, scope) {
    yy.layout.lines.push(this.serialize(scope));
}

export default LineNode;
