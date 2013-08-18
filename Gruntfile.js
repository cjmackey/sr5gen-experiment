module.exports = function(grunt) {
    
    var standard_tasks = ['jshint', 'concat', 'uglify', 'cssmin'];
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                options: {
                    '-W117': true,
                },
                src: ['Gruntfile.js', 'app/js/**.js']
            }
        },
        concat: {
            js: {
                src: ['app/use_strict.js','app/js/**.js'],
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
        },
        watch: {
            files: ['app/js/**.js','app/css/**.css'],
            tasks: standard_tasks,
        },
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    
    grunt.registerTask('default', standard_tasks);
};
