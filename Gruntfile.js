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

		concat: {
			js: {
				src: 'src/js/**/*.js',
				dest: 'resources/app.js'
			},
			css: {
				src: 'src/css/**/*.css',
				dest: 'resources/all.css'
			}
		},

		uglify: {
			options: {
			},
			dist: {
				files: {
					'resources/public/app.min.js': ['resources/app.js']
				}
			}
		},

		cssmin: {
			css:{
				src: 'resources/all.css',
				dest: 'resources/public/all.min.css'
			}
		},

		shell: {
			rmtmp: {
				command: "rm -rf resources"
			},
			mkresources: {
				command: "mkdir -p resources/public"
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-shell');
 
	grunt.registerTask('clean', ['shell:rmtmp', 'shell:mkresources']);
  grunt.registerTask('heroku', ['clean', 'emberTemplates', 'concat', 'uglify', 'cssmin']);  
	grunt.registerTask('default', ['heroku']);
};
