Boethius - Music Notation
-------------------------

A Line is one-dimentional. Indexed by time.

A Staff is two-dimentional. Indexed by line and time.

A Score is three-dimentional. Indexed by Staff, Line, and time.

A score may potentially have pages as well.


Should view render methods return a paper group, or should they return themselves and set this.group?
- If they have this.group then they are a direct representation of the paper group and have to be responsible for removing it on being rendered again.
- If a view doesn't have this.group then it is more like a template.
- Rendering ofter requires multiple render methods for various parts intertwined with render method calls on other "templates".
- subsequent render method calls require both the view and the group. Hard to keep explicit reference between view and group without group property on the view.

TODOS:
    # High priority
    - Voices crossing lines.
    - placement.commonShortestDuration implementation.
    - Repeats
    - Da Capo / Dal Segno
    - Anacrusis
    - Minimum stem heights.
    - Tie inflection points.
    - Clef change markings at end of system.
    - Fermata

    # Lower priority
    - SMuFL
    - MusicXML
    - Score title, tempo, composer.
    - There should be a segregation between files that require paper.js and those that do not.
    - Implement different staff type rendering. StaffGroup, ChoirStaff, GrandStaff, and PianoStaff.
    - Line/Instrument Names.
    - Instrument transpositions.
    - optional rendering of measure numbers.
    - Logger
    - Remove "magic" strings/numbers.
    - Vary stem direction of beamed notes. aka kneed beams
    - Stricter ES6 Linting
    - Better articulation placement
    - Additional articulations/ornaments
    - improved dynamic positioning
    - Ability to turn features on/off for performance reasons.
    - Fix double rendering of ledger lines.
    - Lyrics
    - Ability to specify horizontal position of systems.
    - How to handle non-standard note durations? ex. a4/6

ISSUES:
