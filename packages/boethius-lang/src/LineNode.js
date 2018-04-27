import { LINE } from './constants';

function LineNode (props) {
    this.props = props;
}

LineNode.prototype.type = LINE;

LineNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
};

LineNode.prototype.serialize = function () {
    return Object.assign({}, this.props, {type: LINE});
}

export default LineNode;
