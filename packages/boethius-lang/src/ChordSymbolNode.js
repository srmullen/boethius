const CHORDSYMBOL = "chordSymbol";

function ChordSymbolNode (props) {
    this.props = props;
}

ChordSymbolNode.prototype.type = CHORDSYMBOL;

ChordSymbolNode.prototype.clone = function () {};

export default ChordSymbolNode;
