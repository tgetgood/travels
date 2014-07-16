	module.exports = function(grunt) {
		
  grunt.initConfig({
 
		emberTemplates: {
			compile: {
				options: {
					templateBasePath: /src\/html\/templates/
				},
				files: {
					'resources/templates.js': 'src/html/templates/**/*.hbs'
				}
			}
		},

		concat: {
			js: {
				src: 'src/js/main.js',
				dest: 'resources/main.js'
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
					'resources/public/main.min.js': ['resources/main.js'],
					'resources/public/templates.min.js': ['resources/templates.js']
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
        files : ["src/html/**/*.html", 'src/js/**/*', "src/css/**/*", "resources/templates.js"], 
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
