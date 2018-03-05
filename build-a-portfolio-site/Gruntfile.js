/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            /* Change these */
            width: 1600,
            height: 1200,
            name: 'large_2x',
            quality: 60
          },{
            width: 800,
            height: 600,
            name: 'medium',
            quality: 60
          },{
            width: 1000,
            height: 750,
            name:"large_1x",
            quality: 60
          },{
            width:500,
            height: 375,
            name:"small",
            quality: 60
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'images_src/',
          dest: 'images/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['images']
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['clean', 'mkdir','responsive_images']);

};
