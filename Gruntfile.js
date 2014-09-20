module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            main: {
                src: [
                    'dev/js/*.js'
                ],
                dest: 'js/assembled.js'
            }
        },

        uglify: {
            main: {
                files: {
                    'js/assembled.min.js': '<%= concat.main.dest %>'
                }
            }
        },

        sass: {
           dist: { 
             options: {
               style: 'expanded',
               sourcemap: 'none'
             },
             files: [{
               expand: true,
               cwd: 'dev/styles',
               src: ['**/*.scss'],
               dest: 'dev/css',
               ext: '.css'
             }]
           }
         },

        cssmin: {
          my_target: {
            files: [{
              expand: true,
              cwd: 'dev/css/',
              src: ['*.css', '!*.min.css'],
              dest: 'css/',
              ext: '.min.css'
            }]
          }
        },

        // cmq: {
        //   options: {
        //     log: false
        //   },
        //   your_target: {
        //     files: {
        //       'dev/css': ['dev/css/*.css']
        //     }
        //   }
        // },

        htmlmin: {  
            dist: {     
              options: {             
                collapseWhitespace: true
              },
              files: { 
                'index.html': 'dev/index.html'
              }
            }
        },

        watch: {
          scripts: {
            files: ['dev/*.html', 'dev/**/*.scss', 'dev/**/*.css', 'dev/**/*.js'],
            tasks: ['default'],
            options: {
              spawn: false,
            },
          },
        }

    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('default', ['newer:htmlmin', 'newer:sass', 'newer:cssmin','newer:concat', 'newer:uglify', 'watch']);
};