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
        systems: this.systems.map(system => system.toJSON()),
        timeSignatures: this.timeSignatures
    };
}

export default Layout;
