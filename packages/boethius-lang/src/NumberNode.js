function NumberNode (value) {
    this.value = Number(value);
    this.props = {};
}

NumberNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, this);
    return this;
}

export default NumberNode;
