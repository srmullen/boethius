boethius-lang
=============

Music description language for Scores and Sound.

TODO
====

- Repeats
- intervals ex. sixth, octave
- Math
- Scales
- Transposition
- Immutable data structures?
- Clef change in voice.
- Force display of accidentals. Probably requires boethius changes as well.

Ideas
-----
- Notes preceded with certain characters are accented. A `.` could mean staccato, `_` = tenuto, `^` = accent. Maybe multiple characters can combine to have different meanings, such as `~` = mordant and `,~` = inverted mordant.
- Barline are not meaningless characters but instead help apply time to events.

Docs
----
- To build the command line application run `npm run bin`.
