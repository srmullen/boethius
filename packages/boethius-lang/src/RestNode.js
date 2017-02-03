const REST = "rest";

function RestNode (props) {
    this.props = props;
}

RestNode.prototype.type = REST;

RestNode.prototype.clone = function (newprops) {
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
