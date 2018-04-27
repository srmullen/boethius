import { PAGE } from './constants';

function PageNode (props) {
    this.props = props;
}

PageNode.prototype.type = PAGE;

PageNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
}

PageNode.prototype.serialize = function (scope) {
    return Object.assign({}, scope, this.props, {type: PAGE});
}

PageNode.prototype.execute = function (yy, scope) {
    yy.layout.pages.push(this.serialize(scope));
}

export default PageNode;
