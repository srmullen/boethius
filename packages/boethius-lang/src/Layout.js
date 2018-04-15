import { SCORE } from './constants';

function Layout () {
    this.timeSignatures = [];
    this.lines = [];
    this.systems = [];
}

Layout.prototype.serialize = function () {
    return {
        type: SCORE,
        lines: this.lines.map(line => line.toJSON()),
        timeSignatures: this.timeSignatures
    };
}

export default Layout;
