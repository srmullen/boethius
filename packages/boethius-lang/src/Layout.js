import { SCORE } from './constants';

function Layout (props={}) {
    this.props = props;
    this.timeSignatures = [];
    this.lines = [];
    this.systems = [];
    this.pages = [];
}

Layout.prototype.set = function (props) {
    this.props = Object.assign({}, this.props, props);
    return this;
}

Layout.prototype.serialize = function () {
    const lines = this.lines.map(line => line.serialize());
    const systems = this.systems.map(system => system.serialize());
    const pages = this.pages.length ? this.pages.map(page => page.serialize()) : [{systems: systems.length, staffSpacing: []}];
    return Object.assign({}, this.props, {
        type: SCORE,
        lines,
        systems,
        pages,
        timeSignatures: this.timeSignatures
    });
}

export default Layout;
