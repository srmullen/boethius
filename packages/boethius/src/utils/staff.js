import _ from "lodash";

/*
 * Groups and indexes voices by the lines they are to be rendered on. Voice names take priority, then order.
 * @param lines - Line[]
 * @param Voices - Voice[]
 * @return Map<Line, Voice[]>
 */
function groupVoices (lines, voices) {
    const voiceMap = new Map();
    _.each(voices, (voice, i) => {
        let voiceArr = voiceMap.get(lines[i]) || [];
        voiceMap.set(lines[i], voiceArr.concat(voice));
    });
    return voiceMap;
}

export {groupVoices};
