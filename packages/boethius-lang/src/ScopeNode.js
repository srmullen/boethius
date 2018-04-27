function ScopeNode (props={}, children=[]) {
    this.props = props;
    this.children = children;
}

ScopeNode.prototype.set = function (newprops) {
    const props = Object.assign({}, this.props, newprops);
    return new ScopeNode(props, this.children);
};

/*
 * @param scope - The outer scope.
 */
ScopeNode.prototype.serialize = function (scope={}) {
    const props = Object.assign({}, scope, this.props);
    return this.children.reduce((acc, item) => {
        const json = item.serialize(props);
        return acc.concat(json);
    }, []);
}

ScopeNode.prototype.execute = function () {
    this.children.map(child => {
        return child.set(this.props);
    });
    return this;
}

export default ScopeNode;
