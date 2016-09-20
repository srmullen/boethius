Tracking Down Memory Leaks in Boethius
======================================

Clef, TimeSignature, and Key do not have memory leaks. Note does have a leak though.
In the tests Note is being rendered through the Scored.prototype.render method, but
the Other items are rendered with the method on their own prototypes.

```javascript
// leak
function createNote () {
	var note = scored.note();
	return scored.render(note);
}

// Change Note test to render using just its own method.

// no leak
function createNote () {
	var note = scored.note();
	return note.render();
}
```

The version with no leak only renders the note head whereas the version with the
leak also handles rendering the accidentals and stem.

- Heap snapshot sizes are decreasing after the no leak tests are run.
- Note has this.group, this.symbol and this.noteHead references to paper objects. Other items don't. Possible culprit.
- White background for pdfs could appears to be and issue, but not cause of everything.
```javascript
// background creating code in Scored.prototype.render method
const background = new paper.Path.Rectangle(paper.view.bounds);
background.fillColor = "white";
```
- Running scored.render(note) 1000 times
With background: 11.4 -> 16.1
Without background: 11.7 Mb -> 14.5
- Seemed to run much slower with background.


## Run scored.render with the accidental rendering method commented out.
11.4 Mb -> 13.7 Mb
## Run scored.render with the stem rendering method commented out.
11.7 -> 12.8
## Run scored.render with the accidental and stem rendering methods commented out.
11.4 Mb -> 10.7 Mb

Looks like both accidental and stem rendering methods both have some memory leakage.
l.parent only reports 1 child, 1000 Groups still have references. This is the number of times the createNote function was run.
```javascript
// In Note.prototype.render
// commenting this line removed the Group mem leak. This ran much slower though,
// probably due to garbage collection now happening.
group.addChild(noteHead);
```

## Rest
Plain rest does not create memory leak. Rest with dots does create mem leak.
Not even returning anything from rest.drawDots or doing anything that looks impure and still getting leak.
Simply mentioning this.group.bounds in rest.drawDots causes the mem leak.

Unmemoizing the engraver.drawRest function fixes the memory leak for rest even when accessing rest.group.bounds.

- Comparison of memoized/non-memoized drawRest function. 1000 times.
Memoized: ~550ms
Non-Memoized: ~700ms
Non-Memoized and No SymbolDefinition: ~650ms

Unmemoizing note head drawing also fixes the memory leak for notes.

Using the engraver.drawBounds method on clef is causing a mem leak. It doesn't seem to have an effect on timesig though.
The cause of this was because the bounds was being added directly to the PointText item rather than a "clef" group that
the point text belonged to. TimeSignature was already a group because it was composed of two point texts.

No new issues found testing System.render.
No new issues found testing Score.render.
