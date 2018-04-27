import { SYSTEM } from './constants';

function SystemNode (props = {}) {
    this.props = props;
}

SystemNode.prototype.type = SYSTEM;

SystemNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
}

SystemNode.prototype.serialize = function (scope) {
    return Object.assign({}, scope, this.props, {type: SYSTEM});
}

SystemNode.prototype.execute = function (yy, scope) {
    yy.layout.systems.push(this.serialize(scope));
}

export default SystemNode;
