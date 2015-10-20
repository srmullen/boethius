import _ from "lodash";

import Line from "./Line";
import Staff from "./Staff";

/*
 * Class for managing Staves and Lines.
 * Meta data such as title/composer could also be attached here.
 */
function Score (context={}, children=[]) {
    /*
     * A score should have both staves and lines.
     * A line represents all measures from 0 to the end of the score. It is one-dimentional.
     * A stave represents a section of the measures from all the lines. It is two-dimentional.
     */
    const types = _.groupBy(children, child => child.type);

    this.staves = types.staff || [];
    this.lines = types.line || [];
}

export default Score;
