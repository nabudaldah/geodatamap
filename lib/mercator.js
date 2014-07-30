var Mercator = function() {

  this.width  = 1,
  this.height = 1,

	// eerst scale, dan offset
	this.offset = { x: 0, y: 0 };
	this.scale  = { x: 1, y: 1 };
  
  // View box
  this.box = { north: 90, east: -180, south: -90, west: 180 };
  
	this.zoom = function (factor, x, y) {
    var lat = this.lat(y);
    var lon = this.lon(x);
		this.scale.x *= factor;
		this.scale.y *= factor;
		this.center(lat, lon); // lat/lon
		this.centerXY(this.width / 2 - x, this.height / 2 - y); // x/y
	},
    
  this.zoomcenter = function(factor){
    var lat = this.lat(this.height / 2);
    var lon = this.lon(this.width  / 2);
    this.scale.x *= factor;
    this.scale.y *= factor;
    this.center(lat, lon); // lat/lon
  },
  
	this.reset = function () {
		this.scale.x = 1;
		this.scale.y = 1;
    this.offset.x = 0;
    this.offset.y = 0;
		this.center(0, 0); // lat/lon
	},
  
  this.viewbox = function(){
    var zoomx = (this.x(this.lon(this.width)) - this.x(this.lon(0))) / (this.x(this.box.east) - this.x(this.box.west));
    var zoomy = (this.y(this.lat(0)) - this.y(this.lat(this.height))) / (this.y(this.box.north) - this.y(this.box.south));
    var zoom  = Math.min(zoomx, zoomy);
    this.zoomcenter(zoom * 0.75);
    this.center((this.box.north + this.box.south)/2, (this.box.east + this.box.west) / 2); // lat/lon version
  },
  
	this.center = function (lat, lon) {
		this.offset.x -= this.x(lon) - this.x(this.lon(this.width / 2));
		this.offset.y -= this.y(lat) - this.y(this.lat(this.height / 2));
	},

	this.centerXY = function (x, y) {
		this.offset.x -= x;
		this.offset.y -= y;
	},
  
	// Credits: http://wiki.openstreetmap.org/wiki/Mercator
	this.x = function (lon) {
		return (lon * this.scale.x) + this.offset.x;
	},
	this.y = function (lat) {
		return - (180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * (Math.PI / 180) / 2)) * this.scale.y) + this.offset.y;
	},
	this.lon = function (x) {
		return (x - this.offset.x) / this.scale.x;
	},
	this.lat = function (y) {
		return (-180 / Math.PI * (2 * Math.atan(Math.exp(((y - this.offset.y) / this.scale.y) * Math.PI / 180)) - Math.PI / 2));
	}
}
