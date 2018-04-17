import { SCORE } from './constants';

function Layout () {
    this.timeSignatures = [];
    this.lines = [];
    this.systems = [];
    this.pages = [];
}

Layout.prototype.serialize = function () {
    const lines = this.lines.map(line => line.toJSON());
    const systems = this.systems.map(system => system.toJSON());
    const pages = this.pages.length ? this.pages.map(page => page.toJSON()) : [{systems: systems.length, staffSpacing: []}];
    return {
        type: SCORE,
        lines,
        systems,
        pages,
        timeSignatures: this.timeSignatures
    };
}

export default Layout;
