import WebFont from "webfontloader";
import "../../styles/fonts.css";

export default function load () {
    return new Promise((resolve, reject) => {
        WebFont.load({
            custom: {
                families: ["gonville", "gonvillealpha"]
            },
            active: resolve,
            inactive: reject
        });
    });
}
