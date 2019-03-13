Virtual Score
=============

Boethius currently renders it's entire self every time the render function is called.
I do not expect that this is the optimal approach for being able to quickly change
the score on the fly as is the expectation with Gradus. Response to new input needs
to render rapidly.

1. Boethius needs to be responsible for creating its own objects.
2. Need JSON structure for representing the Score. MusicJSON?

At first the smallest group to be rerendered will be a System.

TODO
----
- Remove Line.render code. The concept of line doesn't make sense to render.
