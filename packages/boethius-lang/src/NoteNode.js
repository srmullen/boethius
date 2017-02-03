const NOTE = "note";

function NoteNode (props) {
    this.props = props;
}

NoteNode.prototype.type = NOTE;

NoteNode.prototype.clone = function (newprops) {
    var props = Object.assign({}, this.props, newprops);
    return new NoteNode(props);
};

NoteNode.prototype.toJSON = function () {
    return Object.assign({}, this, {type: NOTE});
};

export default NoteNode;
