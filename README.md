# Duct Tape Canvas
A toy project to play with canvas contexts, collision detection, and virtual duct tape :)

This repo has 5 progressive toy problems to solve to build an interactive duct-tape
app on the HTML5 canvas. We've never run through this in it's entirety before, so we have
no idea how long it's going to take people- our goal was to make a play space interesting
and big enough that no one would get bored. If all the pieces come together you'll have
a small functional canvas app that allows you to remove strips of duct tape from the
covered image, but only when those strips aren't covered by any other strips.

It's **strongly** recommended you at least scan through the docs
provided here before you YOLO into the code, but if you can't be bothered the challenge
descriptions are in the last section of this manual.

You're welcome to use google, stackoverflow, and any resources that'll help you.

Feel free to divide and conquer the challenges to cover as many as you can or go
heads down and do a solo deep-dive on just the parts that are most interesting to you- it's
all good.

## Dev Setup
1. Fork this repo and then check it out to a local directory
2. From within that local directory, run
`python -m SimpleHTTPServer 8000`

This should start a simple http server on port 8000.
3. Navigate to:
`http://localhost:8000/canvas.html`

And you should see the Man Crates 2015 team photo covered by colorful strips of duct
tape. Pop open your dev console and click around- you'll see a lot of scaffolding work
is already done for you.

## Repo Components
This is a small app with a few objects to manage drawing strips of duct tape, detecting
how the strips interact with one another and how the user interacts with them.

First look at canvas.html and you'll see the small javascript block that initializes the
Wrapper object as soon as our texture image is loaded. We don't use the texture image yet,
but this pattern will save you a bunch of heartache if you choose to try problem `B` below :)

### Wrapper.js
The Wrapper object is our highest level class, storing the array of `strips` we have in
the world, a `board` object that abstracts away some of the low-level canvas interactions,
and methods to evaluate user interactions. The `C`, `D`, and `E` challenges live in this
class but won't function until we address challenge `A`.

### util.js
There's some low level mathy stuff and most of our code to pre-populate the board with
strips in here. The only thing you'll need to use is the incredibly handy
`getLineIntersection` method. More on that later.

### Strip.js
This is a low level class to represent a strip and its properties, and it's where the
`contains(coord)` method to detect coordinate collision detection and the
`overlaps(otherStrip)` methods for overlap detection lives. If you're ready to dive in
 you can skip the rest of the background reading and go straight into challenge `A` to
 fill in the `overlaps(otherStrip)` method.

### StripCanvas.js
This is the singleton class responsible for handling all the actual draw commands on the
canvas. If you've never worked with HTML5 canvases before there are some good patterns
in here, the first is that you almost always want to keep your weird canvas code in a
class all by itself :)

If you object to doing a little geometry and want to skip challenge `A`, you could
probably spend the entire duration of the hackathon dressing up the `drawStrip` method
described in challenge `B`.

If you object to playing with low-level canvas drawing code, you can skip challenge `B`
and spend all day working on collision detection and interaction. :)

## Background
There are several ways to approach click detection working with HTML5 canvases, this
repo started out as a Man Crates hack day project and we wanted to roll our own. There
are some significant performance benefits to the approach we took, but it's tailored
specifically to this problem and is pretty mathy.

Rather than be represented by a coordinate set in space, strips are represented by
a single line equation in the coordinate space. See the object initializer in
`strip.js`.

![strips are represented as line formulas](https://github.com/mancrates/canvas_project/blob/master/project/strip_line_formula.jpg)

From this single line equation we can derive everything we need and algebraically
see if a click at a given coordinate falls within the strip's boundaries. See the
`Strip.prototype.contains(coord)` method in `strip.js`

![the line formula lets us solve collision detection hella fast](https://github.com/mancrates/canvas_project/blob/master/project/strip_collision_detection.jpg)

We want our clicks to interact with the highest strip, and because we're using the sort
order of the `Wrapper.strips` array to store our strip depth order we can easily iterate
from last to first to see which strip our click hits first. See `getClickedStripIndex(coord)`
in `Wrapper.js`

![the line formula lets us solve collision detection hella fast](https://github.com/mancrates/canvas_project/blob/master/project/strip_sorted_depth_collision.jpg)

We can even use this same algebraic advantage to check to see if strips overlap by
solving the lines against each other to see if any of the 4 possible intersections
exist within our board space. The algebra work is already done for you in the
`getLineIntersection(lineA, lineB, topLeft, bottomRight)` method in `util.js`

![here's the business right here](https://github.com/mancrates/canvas_project/blob/master/project/multi_strip_collisions.jpg)

#Coding Challenges

## A. Object Collision Detection
We're going to complete the `Strip.prototype.overlaps` method so we have a tool to see
if one strip overlaps another strip within the bounds of our canvas. If two strips are on
a collision course and will eventually overlap somewhere else in space, we don't count
that as an overlap.

This method should evaluate the geometry of the strip's own lines and the lines of
another given strip to see if they intersect.

The `getLineIntersection` method in `util.js` is going to do your algebra homework for you.

Refer to the diagrams in the background info above for a refresher on lines and how to
deal with strips as lines.

When you're done, take a screenshot to send to your 9th grade geometry teacher. They'll
be really proud of you.

If you're completely stuck and tired of math, you can skip to challenge `B` and spend all
your time working with canvas image manipulation. This is a totally valid choice and
you could easily spend a day refining the look & feel of the strips in challenge B. You'll
need to get the answer to A before you can complete challenges `C`, `D`, or `E`.

## B. Draw a Very Fancy Strip (optional)
This is an optional tangent to go deep into canvas image manipulation. If that sounds
awful feel free to skip this one and keep jamming on the JS & interactivity problems in
the other challenges.

If you do decide to go down this rabbit hole, you'll rewrite the
`StripCanvas.prototype.drawStrip` method to use the `strip.textureSrc` property to pull
in a duct tape texture and combine it with the `strip.color` property to render out a
fancy version of the duct tape.

![for inspiration](https://github.com/mancrates/canvas_project/blob/master/project/ddt_texture_inspiration.jpg?raw=true)

Unlike the other challenges, gauging success on this one is primarily up to you. Here's
a screenshot of what our canvas looked like with a fancier drawing routine, but take this
in any direction you'd like.

A recommended approach for this is:
 1. Do some `hello world` type image creation on the canvas
 2. Read up on canvas context translation
 3. Figure out how to turn our `strip` geometry properties into useful translations
 4. Experiment with multiple draws to combine texture and color, mess with texture offsets, etc.

Make sure to reset or track changes to your canvas context if you modify it.

##C. Devise a Strategy to See if Strips Overlap
Now that we have a method to detect if one strip overlaps with another, we have everything
we need to write a method in our high level object to see if the strip we're interacting
with is covered by another strip- this is really useful if we want to make it so the user
can only remove strips that aren't covered by other strips.

Using a simlar depth-sorted routine as `Wrapper.getClickedStripIndex` to your advantage,
complete the `Wrapper.getOverlappingStrips` method to see if the strip clicked is covered
by any others.

We really want to get back the full array of indices for overlapping strips, but a
true / false method is a good start.
- a method that returns true or false will work for todo D
- you'll need the full set of overlapping strips for todo E

##D. Make the Board Interactive
This challenge requires successful completion of `A` and `C`.

Once we've completed our low-level methods, we're ready to make this an interactive app.
Combine the methods you've made above with the `Wrapper.redraw` to make it so when the
user clicks a strip that isn't covered by any others, remove it and redraw the board.

##E. Provide the User with Validation Feedback
This challenge requires successful completion of `A`, `C` and `D`, and a revisit to the
`StripCanvas.prototype.drawStrip` method in `B`.

Combine all the pieces of the solution so that when a user clicks a strip that's covered
by another strip, you helpfully redraw the overlapping strips with a color indicating
they're obstructing the first strip. Red is usually a good color for that kind of thing.


#Thanks for Joining Us Today!

![mancrates holiday success](https://github.com/mancrates/canvas_project/blob/master/project/join_us.jpg?raw=true)
We're so happy you decided to spend this time with us and hope to see you soon!

Cheers!

-Team Man Crates
