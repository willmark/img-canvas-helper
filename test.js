var imgutil = require("./index");

var Convert = imgutil.Convert;

var img = __dirname + "/test.jpg";

exports.cropImageMissingParms = function(a) {
    a.expect(1);
    a.throws(function() {
        imgutil.resize();
    }, /imgsrc, width, height, and callback required/);
    a.done();
};

exports.cropImageMissingCallback = function(a) {
    a.expect(1);
    a.throws(function() {
        imgutil.resize(img, 200, 200);
    }, /Callback required/);
    a.done();
};

exports.cropImageMissingImg = function(a) {
    a.expect(1);
    a.throws(function() {
        imgutil.resize(200, 200, function() {});
    }, /imgsrc, width, height, and callback required/);
    a.done();
};

exports.cropImageFile = function(a) {
    a.expect(1);
    imgutil.crop(img, 200, 300, function(result, data) {
        a.ok(result);
        a.done();
    });
};

exports.resizeImageFile = function(a) {
    a.expect(1);
    imgutil.resize(img, 200, 200, function(result, data) {
        a.ok(result);
        a.done();
    });
};

exports.resizeImageMissingMaxDim = function(a) {
    a.expect(1);
    a.throws(function() {
        imgutil.resize(img, function(result, data) {});
    });
    a.done();
};

exports.conversionTransformResize = function(a) {
    a.expect(1);
    fs = require("fs");
    var ws = fs.createWriteStream(__dirname + "/resize.jpg");
    ic = new Convert({
        img: "test.jpg",
        method: "resize",
        width: 300,
        height: 200
    });
    ic.on("data", function(chunk) {
        ws.write(chunk);
    });
    ic.on("end", function() {
        ws.end();
        ws.on('finish', function () {
            a.ok(true);
            a.done(); //wait for the write stream to close, or test will end too soon
        });
    });
};

exports.conversionTransformCrop = function(a) {
    a.expect(1);
    fs = require("fs");
    var ws = fs.createWriteStream(__dirname + "/crop.jpg");
    ic = new Convert({
        img: "test.jpg",
        method: "crop",
        width: 300,
        height: 300
    });
    ic.on("data", function(chunk) {
        console.log('writing chunk ' + chunk.length);
        ws.write(chunk);
    });
    ic.on("end", function() {
        ws.end();
        ws.on('finish', function () {
            a.ok(true);
            a.done(); //wait for the write stream to close, or test will end too soon
        });
    });
};
