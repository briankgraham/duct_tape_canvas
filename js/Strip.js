/*
  Strip abstracts away low-level geometry from StripCanvas
  and Wrapper- manages click detection and basic collision detection
 */
var Strip = function(img, rotationDeg, offset){

  // Define the line properties in terms of rotation and offset from origin
  this.rotation = deg2rad(rotationDeg);
  this.offset = offset;


  // Define the image
  this.textureSrc = img;
  this.textureHeight = img.height;
  this.textureWidth = img.width;

  // Memoize the line properties in the canvas space
  this.yHeight = (this.textureHeight / Math.cos(this.rotation));
  this.xWidth = (GLOBAL_WIDTH / Math.cos(this.rotation));

  // Set some random display properties so we can tell our strips apart
  this.color = ['#cab9ad','#553220','#878692','#7f432c','#cbad99','#020001',
    '#a68968','#d1c5bf','#524331','#35293f'][Math.round(Math.random()*9.99)];
};

/*
  Evaluate an {x,y} coordinate to see if it falls within the geometry of this strip
*/
Strip.prototype.contains = function(coord) {
  // Get the slope of the line...
  var m = Math.tan(this.rotation);

  // Solve for y at the base of the strips geometry for the coords x value
  var baseY = ((m * coord.x) + this.offset);

  // Solve for y at the top of the strips geometry for the coords x value
  var topY = (m * coord.x) + this.yHeight + this.offset;

  // See if the coords y value falls in between the two
  return coord.y > baseY && coord.y < topY;
};

/*
  -------------------------------------------------------------------------------------
  @Todo A: object collision detection
  -------------------------------------------------------------------------------------
  Should evaluate the geometry of this strip and another strip to see if they intersect
   - should use the getLineIntersection method in util.js
   - lines are defined geometrically as a slope (m) and initial offset (b)
   - method should return true / false to indicate if there's an overlap
*/
Strip.prototype.overlaps = function(otherStrip){
  var line1 = {
    m: Math.tan(this.rotation),
    b: this.offset
  }
  var line2 = {
    m: Math.tan(otherStrip.rotation),
    b: otherStrip.offset
  }
  return getLineIntersection(line1, line2, {x:0, y: 0}, {x: window.width, y: window.height});
};

