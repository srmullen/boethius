import { LINE } from './constants';

function LineNode (props) {
    this.props = props;
}

LineNode.prototype.type = LINE;

LineNode.prototype.clone = function (newprops) {
    const props = Object.assign({}, this.props, newprops);
    return new LineNode(props);
};

LineNode.prototype.toJSON = function () {
    return Object.assign({}, this.props, {type: LINE});
}

export default LineNode;
