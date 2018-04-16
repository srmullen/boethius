import { CHORDSYMBOL } from './constants';

function ChordSymbolNode (props) {
    this.props = props;
}

ChordSymbolNode.prototype.type = CHORDSYMBOL;

ChordSymbolNode.prototype.set = function () {};

export default ChordSymbolNode;
