module.exports = function(grunt) {
  
  grunt.initConfig({
 
		emberTemplates: {
			compile: {
				options: {
					templateBasePath: /src\/html\/templates/
				},
				files: {
					'resources/public/templates.js': 'src/html/templates/**/*.hbs'
				}
			}
		},

    watch :{
			emberTemplates: {
				files: 'src/html/templates/**/*.hbs',
				tasks: ['emberTemplates']
			},
      scripts :{
        files : ['src/**/*'], // Efficiency be damned in dev mode, right?
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
