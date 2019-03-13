// @flow
import type { LineProps, System, Page } from './types';
import { SCORE } from './constants';

class Layout {

    props: {}
    timeSignatures: Array<mixed>
    lines: Array<LineProps>
    systems: Array<System>
    pages: Array<Page>

    constructor (props: {} = {}) {
        this.props = props;
        this.timeSignatures = [];
        this.lines = [];
        this.systems = [];
        this.pages = [];
    }

    set (props: {}) {
        this.props = Object.assign({}, this.props, props);
        return this;
    }

    serialize () {
        const pages = this.pages.length ? this.pages : [{systems: this.systems.length, staffSpacing: []}];
        return Object.assign({}, this.props, {
            type: SCORE,
            lines: this.lines,
            systems: this.systems,
            pages,
            timeSignatures: this.timeSignatures
        });
    }

    execute () {
        return this;
    }
}

export default Layout;
