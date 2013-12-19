var imgutil = require("./index");

exports.cropImageMissingParms = function(a) {
    a.expect(1);
    a.throws(function() {imgutil.resize();
    }, /imgsrc and maxdim required/);
    a.done();
};

exports.cropImageMissingCallback = function(a) {
    a.expect(1);
    img = __dirname + "/test.jpg";
    a.throws(function() {imgutil.resize(img, 200, 200);
    }, /Callback required/);
    a.done();
};

exports.cropImageMissingImg = function(a) {
    a.expect(1);
    img = __dirname + "/test.jpg";
    a.throws(function() {imgutil.resize(200, 200, function(){});
    }, /imgsrc required string parameter/);
    a.done();
};

exports.cropImageFile = function(a) {
    a.expect(2);
    img = __dirname + "/test.jpg";
    imgutil.crop(img, 200, 300, function(result, data) {
        a.ok(result);
        imgutil.writeCanvas(data, __dirname + "/crop.jpg", function(result, data) {
            a.ok(result);
            a.done();
        });
    });
};

exports.resizeImageFile = function(a) {
    a.expect(2);
    var canvas;
    imgutil.resize(img, 200, function(result, data) {
        a.ok(result);
        canvas = data;
        imgutil.writeCanvas(canvas, __dirname + "/resize.jpg", function(result, data) {
            a.ok(result);
            a.done();
        });
    });
};

exports.resizeImageMissingMaxDim = function(a) {
    a.expect(1);
    a.throws(function() {imgutil.resize(img, function(result, data) {});});
    a.done();
};
