module.exports = function( grunt )
{
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        
        concat: {
            options: {
                banner: '/*!\n' +
                    ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                    ' * (c) 2013 Stephen Bunch https://github.com/stephenbunch/linqjs\n' +
                    ' * License: MIT\n' +
                    ' */\n'
            },
            dist: {
                src: [
                    'src/intro.js',
                    'src/core.js',
                    'src/outro.js'
                ],
                dest: 'dist/linq.js'
            }
        },

        jshint: {
            dist: [ 'dist/linq.js' ]
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            dist: {
                src: 'dist/linq.js',
                dest: 'dist/linq.min.js'
            }
        },

        jasmine: {
            all: {
                src: 'dist/linq.js',
                options: {
                    specs: 'spec/**/*.spec.js'
                }
            }
        },

        watch: {
            src: {
                files: [ 'src/**/*.js' ],
                tasks: [ 'concat' ]
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-jasmine' );

    grunt.registerTask( 'default', [ 'concat', 'jshint', 'uglify', 'jasmine' ] );
};
