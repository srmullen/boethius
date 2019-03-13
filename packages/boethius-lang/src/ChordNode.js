const CHORD = "chord";

function ChordNode (props, children) {
    this.props = props;
    this.children = children;
}

ChordNode.prototype.type = CHORD;

ChordNode.prototype.clone = function (newprops) {
    var props = Object.assign({}, this.props, newprops);
    var children = this.children.map(function (child) {return child.clone(newprops)});
    return new ChordNode(props, children);
};

ChordNode.prototype.toJSON = function () {
    return Object.assign({}, this, {type: CHORD});
};

ChordNode.prototype.expand = function () {
    return this;
};

export default ChordNode;
