import { CHORDSYMBOL } from './constants';

function ChordSymbolNode (props) {
    this.props = props;
}

ChordSymbolNode.prototype.type = CHORDSYMBOL;

ChordSymbolNode.prototype.clone = function () {};

export default ChordSymbolNode;
