module.exports = function(grunt) {
    
    var standard_tasks = ['jshint', 'concat', 'uglify', 'cssmin', 'compress', 'exec:serve'];
    var common_files = ['common/things.js'];
    var server_files = ['server/js/requires.js', 'server/js/main.js'];
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                options: {
                    '-W117': true,
                },
                src: ['Gruntfile.js', 'app/js/**.js', 'common/**.js', 'server/js/**.js']
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
            js_client: {
                src: ['app/use_strict.js'].concat(common_files.concat(['app/js/**.js'])),
                dest: 'app/js.concat.js'
            },
            js_server: {
                src: ['app/use_strict.js'].concat(common_files.concat(server_files)),
                dest: 'server/js.concat.js'
            },
            css: {
                src: ['app/css/**.css'],
                dest: 'app/css.concat.css'
            },
            root_html: {
                src: ['app/login_fragment.html', 'app/partials/root.html'],
                dest: 'app/partials/root.concat.html'
            },
            user_html: {
                src: ['app/login_fragment.html', 'app/partials/user.html'],
                dest: 'app/partials/user.concat.html'
            },
            character_html: {
                src: ['app/login_fragment.html', 'app/partials/character.html'],
                dest: 'app/partials/character.concat.html'
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
            files: ['app/js/**.js','app/css/**.css','server/js/**.js','common/**',
                    'scripts/**','app/*html',
                    'app/partials/user.html','app/partials/root.html','app/partials/character.html'],
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
