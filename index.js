var Canvas = require("canvas");
var Args = require("vargs").Constructor;

/**
 * Resizes an image where longest dimension is within maxdim
 * imgsrc - string path to image to crop
 * maxdim - number length of longest dimension for resized image 
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure
 */
exports.resize = function(imgsrc, maxdim, callback) {
    var args = new Args(arguments);
    if (args.length < 2) throw new Error('imgsrc and maxdim required');
    if (typeof args.last != 'number') throw new Error('maxdim required string parameter');
    if (typeof args.first !== 'string') throw new Error('imgsrc required string parameter');
    if (!args.callbackGiven()) throw new Error('Callback required');

    var Image = Canvas.Image, fs = require("fs");
    var img = new Image();
    img.onerror = function(err) {
        callback(false, err);
    };
    img.onload = function() {
        if (img.width > img.height) {
            ratio = Math.min(img.width, maxdim) / Math.max(img.width, maxdim);
        } else {
            ratio = Math.min(img.height, maxdim) / Math.max(img.height, maxdim);
        }
        var w = Math.round(ratio * img.width, 0);
        var h = Math.round(ratio * img.height, 0);
        var canvas = new Canvas(w, h);
        var ctx = canvas.getContext("2d");
        ctx.scale(ratio,ratio);
        ctx.drawImage(img,0,0);
        callback(true, canvas);
    };
    img.src = imgsrc;
};

/**
 * Crops an image to bounds specified by maxw and maxh
 * imgsrc - string path to image to crop
 * maxw - number width of cropped image
 * maxh - number height of cropped image
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure
 */
exports.crop = function(imgsrc, maxw, maxh, callback) {
    var args = new Args(arguments);
    if (args.length < 3) throw new Error('imgsrc, maxw, maxh, and maxdim required');
    if (typeof args.at(2) != 'number') throw new Error('maxh required int parameter');
    if (typeof args.at(1) != 'number') throw new Error('maxw required int parameter');
    if (typeof args.first !== 'string') throw new Error('imgsrc required string parameter');
    if (!args.callbackGiven()) throw new Error('Callback required');

    var Image = Canvas.Image, fs = require("fs");
    var img = new Image();
    img.onerror = function(err) {
        callback(false, err);
    };
    img.onload = function() {
        var w = img.width;
        var h = img.height;
        var newx = Math.abs(w / 2 - maxw / 2);
        var newy = Math.abs(h / 2 - maxh / 2);
        var canvas = new Canvas(maxw, maxh);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, newx, newy, maxw, maxh, 0, 0, maxw, maxh);
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
