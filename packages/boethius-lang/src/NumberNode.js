// @flow

class NumberNode {
    props: {};

    value: number;

    constructor (value: number | string) {
        this.value = Number(value);
    }

    set (newprops: {}) {
        this.props = Object.assign({}, this.props, this);
        return this;
    }
}

export default NumberNode;
