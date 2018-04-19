import { REST } from './constants';

function RestNode (props) {
    this.props = props;
}

RestNode.prototype.type = REST;

RestNode.prototype.set = function (newprops) {
    var props = Object.assign({}, this.props, newprops);
    return new RestNode(props);
};

RestNode.prototype.toJSON = function () {
    return Object.assign({}, this, {type: REST});
};

RestNode.prototype.expand = function () {
    return this;
};

export default RestNode;