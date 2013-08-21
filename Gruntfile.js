module.exports = function(grunt) {
    
    var standard_tasks = ['jshint', 'concat', 'uglify', 'cssmin', 'compress', 'exec:serve'];
    
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
        compress: {
            js_async: {
                src: 'app/async.js',
                dest: 'app/async.js.gz'
            },
            js_angular_min: {
                src: 'app/lib/angular/angular.min.js',
                dest: 'app/lib/angular/angular.min.js.gz'
            },
            js_angular: {
                src: 'app/lib/angular/angular.js',
                dest: 'app/lib/angular/angular.js.gz'
            },
            js_concat_min: {
                src: 'app/js.concat.min.js',
                dest: 'app/js.concat.min.js.gz'
            },
            js_concat: {
                src: 'app/js.concat.js',
                dest: 'app/js.concat.js.gz'
            }
        },
        concat: {
            js: {
                src: ['app/use_strict.js','app/js/**.js'],
                dest: 'app/js.concat.js'
            },
            css: {
                src: ['app/css/**.css'],
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
            files: ['app/js/**.js','app/css/**.css','scripts/serve.rb'],
            tasks: standard_tasks,
        },
        exec: {
            serve: {
                command: './scripts/serve.rb'
            }
        }
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    
    
    grunt.registerTask('default', standard_tasks);
};
