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
