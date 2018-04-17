import { PAGE } from './constants';

function PageNode (props) {
    this.props = props;
}

PageNode.prototype.type = PAGE;

PageNode.prototype.set = function (newprops) {
    this.props = Object.assign({}, this.props, newprops);
    return this;
}

PageNode.prototype.toJSON = function () {
    return Object.assign({}, this.props, {type: PAGE});
}

export default PageNode;
