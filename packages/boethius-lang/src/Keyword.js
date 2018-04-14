export default function Keyword (keyword) {
    this.value = keyword;
}

Keyword.prototype.toString = function () {
    return this.value;
};
