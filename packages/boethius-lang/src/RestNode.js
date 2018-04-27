import { REST } from './constants';

function RestNode (props) {
    this.props = props;
}

RestNode.prototype.type = REST;

RestNode.prototype.set = function (newprops) {
    var props = Object.assign({}, this.props, newprops);
    return new RestNode(props);
};

RestNode.prototype.serialize = function (scope) {
    const props = Object.assign({}, scope, this.props);
    return Object.assign({}, {type: REST, props});
}

export default RestNode;
