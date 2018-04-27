import { NOTE } from './constants';

function NoteNode (props) {
    this.props = props;
}

NoteNode.prototype.type = NOTE;

NoteNode.prototype.set = function (newprops) {
    var props = Object.assign({}, this.props, newprops);
    return new NoteNode(props);
};

NoteNode.prototype.serialize = function (scope={}) {
    const props = Object.assign({}, scope, this.props);
    return Object.assign({}, {type: NOTE, props});
}

export default NoteNode;
