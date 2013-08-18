module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'app/js/**.js']
        },
        concat: {
            js: {
                src: 'app/js/**.js',
                dest: 'app/js.concat.js'
            },
            css: {
                src: 'app/css/**.css',
                dest: 'app/css.concat.css'
            }
        },
        uglify: {
            js: {
                src: 'app/js.concat.js',
                dest: 'app/js.concat.min.js'
            }
        },
        cssmin: {
            css: {
                src: 'app/css.concat.css',
                dest: 'app/css.concat.min.css'
            }
        }
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    
    
    // Default task(s).
//    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
