function Voice (props = {}, children = []) {
    this.props = props;
    this.children = children;
}

Voice.prototype.execute = function (yy) {
    const list = this.children.reduce((acc, item) => {
        const json = item.serialize();
        return acc.concat(json);
    }, []);
    if (!yy.voices[this.props.name]) {
        // create array for voice items
        yy.voices[this.props.name] = list;
    } else {
        yy.voices[this.props.name] = yy.voices[this.props.name].concat(list);
    }
}

export default Voice;
