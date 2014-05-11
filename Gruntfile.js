module.exports = function(grunt) {
 
 
  grunt.initConfig({
 
    watch :{
      scripts :{
        files : ['resources/public/**/*'],
        options : {
          livereload : 9090,
        }
      }
    }
 
  });
 
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  grunt.registerTask('default', []);  
};
