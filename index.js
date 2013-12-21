var Canvas = require("canvas");

var Args = require("vargs").Constructor;

/**
 * Resizes an image where longest dimension is within maxdim
 * imgsrc - string path to image to crop
 * width - integer length of longest width dimension for resized image 
 * height - integer length of longest height dimension for resized image 
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure
 */
exports.resize = function(imgsrc, width, height, callback) {
    var args = new Args(arguments);
    checkCommonArgs(args);

    var Image = Canvas.Image, fs = require("fs");
    var img = new Image();
    img.onerror = function(err) {
        callback(false, err);
    };
    img.onload = function() {
        ratio = Math.min(
            Math.min(img.width, width) / Math.max(img.width, width),
            Math.min(img.height, height) / Math.max(img.height, height)
        );

        var w = Math.round(ratio * img.width, 0);
        var h = Math.round(ratio * img.height, 0);
        var canvas = new Canvas(w, h);
        var ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        ctx.drawImage(img, 0, 0);
        callback(true, canvas);
    };
    img.src = imgsrc;
};

/**
 * Common argument checking for crop and resize
 */
function checkCommonArgs(args) {
    if (args.length < 3) throw new Error("imgsrc, width, height, and callback required");
    if (typeof args.at(2) != "number") throw new Error("height required int parameter");
    if (typeof args.at(1) != "number") throw new Error("width required int parameter");
    if (typeof args.first !== "string") throw new Error("imgsrc required string parameter");
    if (!args.callbackGiven()) throw new Error("Callback required");
}

/**
 * Crops an image to bounds specified by width and height
 * imgsrc - string path to image to crop
 * width - integer width of cropped image
 * height - integer height of cropped image
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure
 */
exports.crop = function(imgsrc, width, height, callback) {
    var args = new Args(arguments);
    checkCommonArgs(args);
/*
    if (args.length < 3) throw new Error("imgsrc, width, height, and maxdim required");
    if (typeof args.at(2) != "number") throw new Error("height required int parameter");
    if (typeof args.at(1) != "number") throw new Error("width required int parameter");
    if (typeof args.first !== "string") throw new Error("imgsrc required string parameter");
    if (!args.callbackGiven()) throw new Error("Callback required");
*/
    var Image = Canvas.Image, fs = require("fs");
    var img = new Image();
    img.onerror = function(err) {
        callback(false, err);
    };
    img.onload = function() {
        var w = img.width;
        var h = img.height;
        var newx = Math.abs(w / 2 - width / 2);
        var newy = Math.abs(h / 2 - height / 2);
        var canvas = new Canvas(width, height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, newx, newy, width, height, 0, 0, width, height);
        callback(true, canvas);
    };
    img.src = imgsrc;
};

/**
 * Helper to write canvas to an output jpeg file
 * Useful for writing manipulated image back to a file
 * canvas - canvas to write out to disk
 * outfile - string path to output file
 * callback - function (result, data)
 *    result - boolean result true on successful write
 *    data - bytes written on success, or Error on failure
 */
exports.writeCanvas = function(canvas, outfile, callback) {
    var fs = require("fs");
    var out = fs.createWriteStream(outfile);
    out.on("finish", function() {
        callback(true, out.bytesWritten);
    });
    var stream = canvas.createJPEGStream({
        bufsize: 2048,
        quality: 80
    });
    stream.on("error", function(err) {
        callback(false, err);
    });
    stream.on("data", function(buffer) {
        out.write(buffer);
    });
    stream.on("end", function() {
        out.end();
    });
};

var stream = require("stream");
var fs = require("fs");
var Transform = stream.Transform;

/**
 * Transform stream from input image to modified output image
 * usage:  var Convert = require('img-canvas-helper').Convert;
 *         var imgc = new Convert(options);
 *         imgc.on('data', function (chunk) {
 *            //handle tranformed image data chunk
 *         });
 *         imgc.on('end', function () {
 *            //close any open write streams
 *         });
 *         imgc.on('error', function (err) {
 *            //handle errors
 *         });
 * where:
 *         options = {
 *           img:  <required string path to source image>,
 *           method: <required string conversion method ('resize' | 'crop' currently supported)>,
 *           width: <optional integer width of destination image>
 *           height: <optional integer height of destination image>
 *         }
 */
var Convert = function(options) {
    // allow use without new 
    if (!(this instanceof Convert)) {
        return new Convert(options);
    }
    Transform.call(this);
    this.options = options;
    this._init();
};

var util = require("util");

util.inherits(Convert, Transform);

Convert.prototype._init = function() {
    var self = this;
    function cb(result, data) {
        if (!result) {
            self.emit("error", data);
        } else {
            self.reader = data.jpegStream();
            self.reader.pipe(self);
            self.reader.on("end", function() {
                self.push(null);
            });
        }
    }
    switch (this.options.method) {
      case "resize":
        exports.resize(this.options.img, this.options.width, this.options.height, cb);
        break;

      case "crop":
        exports.crop(this.options.img, this.options.width, this.options.height, cb);
        break;

      default:
        this.emit("error", new Error("Option 'method' is invalid"));
    }
};

Convert.prototype._transform = function(chunk, encoding, done) {
    this.push(chunk);
    done();
};

exports.Convert = Convert;
