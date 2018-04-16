import { SYSTEM } from './constants';

function SystemNode (props) {
    this.props = props;
}

SystemNode.prototype.type = SYSTEM;

SystemNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
}

SystemNode.prototype.toJSON = function () {
    return Object.assign({}, this.props, {type: SYSTEM});
}

export default SystemNode;
