import { CHORDSYMBOL } from './constants';

function ChordSymbol (props = {}) {
    this.props = props;
}

ChordSymbol.prototype.serialize = function () {
    return Object.assign({}, {type: CHORDSYMBOL, props: this.props});
}

ChordSymbol.prototype.execute = function (yy) {
    yy.chordSymbols.push(this.serialize());
}

export default ChordSymbol;
