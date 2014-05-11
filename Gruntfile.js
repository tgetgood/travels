module.exports = function(grunt) {
  
  grunt.initConfig({
 
		emberTemplates: {
			compile: {
				options: {
					templateBasePath: /resources\/public\/templates\//
				},
				files: {
					'resources/public/prod/templates.js': 'resources/public/templates/**/*.hbs'
				}
			}
		},

    watch :{
			emberTemplates: {
				files: 'resources/public/templates/**/*.hbs',
				tasks: ['emberTemplates']
			},
      scripts :{
        files : ['resources/public/**/*'],
        options : {
          livereload : 9090,
        }
      }
    }
 
  });
 
  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ember-templates');
 
  grunt.registerTask('default', []);  
};
