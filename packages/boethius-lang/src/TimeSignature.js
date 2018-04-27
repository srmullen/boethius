import { TIMESIG } from './constants';

function TimeSignature (props = {}) {
    this.props = props;
}

TimeSignature.prototype.serialize = function () {
    return Object.assign({}, this.props, {type: TIMESIG});
}

TimeSignature.prototype.execute = function (yy) {
    yy.layout.timeSignatures.push(this.serialize());
}

export default TimeSignature;
