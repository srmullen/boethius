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
    const pages = this.pages.length ? this.pages : [{systems: this.systems.length, staffSpacing: []}];
    return Object.assign({}, this.props, {
        type: SCORE,
        lines: this.lines,
        systems: this.systems,
        pages,
        timeSignatures: this.timeSignatures
    });
}

Layout.prototype.execute = function (yy) {
    return this;
}

export default Layout;
