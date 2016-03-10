/*
 StripCanvas handles all low-level interactions with the
 canvas elements- e.g. redraw, animation, clear.
 StripCanvas does nothing until dom ready and canvas ready
 */
var StripCanvas = function () {};

/*
 Init the canvases within the bounds of the container element
 */
StripCanvas.prototype.init = function (canvasElem, container) {
  canvasElem.width = container.clientWidth;
  canvasElem.height = container.clientHeight;
  this.width = container.clientWidth;
  this.height = container.clientHeight;
  window.width = this.width;
  window.height = this.height;
  this.context = canvasElem.getContext('2d');
  return this;
};

/*
 Draw a strip on the canvas.
 -------------------------------------------------------------------------------------
 @Todo B (optional): draw a fancy strip
 -------------------------------------------------------------------------------------
 Rewrite the draw method to use the strip.textureSrc attribute to pull in a duct tape
 texture and combine it with the strip.color to render out a fancy version of the
 duct tape.
  - Read up on canvas context translation
  - Experiment with multiple draws to combine texture and color
  - Make sure to reset or track changes to your context if you modify it
*/
StripCanvas.prototype.drawStrip = function (strip) {
  var c = this.context;
  var yAtWidth = Math.tan(strip.rotation) * this.width + strip.offset;

  c.beginPath();
  c.moveTo(0, strip.offset);
  c.lineTo(0, strip.offset + strip.yHeight);
  c.lineTo(this.width, yAtWidth + strip.yHeight);
  c.lineTo(this.width, yAtWidth);
  c.fillStyle = strip.color;
  c.fill();

  return this;
};

/*
 A convenience method to clear canvas
 */
StripCanvas.prototype.clear = function () {
  var c = this.context;
  c.clearRect(0, 0, this.width, this.height);
  return this;
};

/*
 A useful debugging tool to draw a dot on a point
 */
StripCanvas.prototype.highlightPoint = function (coord, color) {
  var c = this.context;
  color = color? color : '#FF0000';
  c.beginPath();
  c.moveTo(coord.x, coord.y);
  c.lineTo(coord.x - 6, coord.y + 6);
  c.lineTo(coord.x + 6, coord.y + 6);
  c.lineTo(coord.x, coord.y);
  c.fillStyle = color;
  c.fill();
};

StripCanvas.prototype.highlightLine = function (coordA, coordB) {
  var c = this.context;
  c.beginPath();
  c.moveTo(coordA.x, coordA.y);
  c.lineTo(coordB.x, coordB.y);
  c.lineWidth = 15;
  c.strokeStyle = '#99FF99';
  c.stroke();
};

