img-canvas-helper
============

> Stability - 2 Unstable

Helper function to resize or crop jpeg images using node canvas module (requires Cairo)

## API

````
resize(img, maxdim, function(result, data))

Resizes an image where longest dimension is within maxdim
 * imgsrc - string path to image to crop
 * maxdim - number length of longest dimension for resized image 
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure

````

````
crop(img, maxw, maxh, function(result, data))

Crops an image to bounds specified by maxw and maxh
 * imgsrc - string path to image to crop
 * maxw - number width of cropped image
 * maxh - number height of cropped image
 * callback - callback function(
 *     result - boolean true on success
 *     data - canvas object on success, Error on failure

````

````
writeCanvas(canvas, outfile, function(result, data))

Helper to write canvas to an output jpeg file
 * Useful for writing manipulated image back to a file
 * canvas - canvas to write out to disk
 * outfile - string path to output file
 * callback - function (result, data)
 *    result - boolean result true on successful write
 *    data - bytes written on success, or Error on failure

````
