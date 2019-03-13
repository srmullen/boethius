import constants from "../constants";

function Page ({staffSpacing=[]}, children=[]) {
    this.children = children;
    this.staffSpacing = staffSpacing;
};

Page.prototype.type = constants.type.page;

export default Page;
