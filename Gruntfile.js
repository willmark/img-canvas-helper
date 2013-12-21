module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        preprocess: {
            js: {
                src: "index.js",
                dest: "src-pp/index.js"
            }
        },
        jshint: {
            files: [ "*.js" ]
        },
        nodeunit: {
            all: [ "test.js" ]
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: "src-pp/**.js",
                dest: "dist/file-compare.min.js"
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-preprocess");
    grunt.registerTask("default", [ "jshint", "nodeunit", "preprocess", "uglify" ]);
};
