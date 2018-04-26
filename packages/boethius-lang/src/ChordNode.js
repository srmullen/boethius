import { CHORD } from './constants';

function ChordNode (props, children) {
    this.props = props;
    this.children = children;
}

ChordNode.prototype.type = CHORD;

ChordNode.prototype.set = function (newprops) {
    const props = Object.assign({}, this.props, newprops);
    const children = this.children.map(function (child) {return child.set(newprops)});
    return new ChordNode(props, children);
};

ChordNode.prototype.serialize = function (scope) {
    const props = Object.assign({}, scope, this.props);
    const children = this.children.map(child => child.serialize(scope));
    return Object.assign({}, {type: CHORD, props, children});
}

ChordNode.prototype.toJSON = function () {
    return Object.assign({}, this, {type: CHORD});
};

ChordNode.prototype.expand = function () {
    return this;
};

export default ChordNode;
