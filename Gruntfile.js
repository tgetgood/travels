module.exports = function(grunt) {
	
  grunt.initConfig({

		concat: {
			css: {
				src: 'src/css/**/*.css',
				dest: 'resources/all.css'
			}
		},

		cssmin: {
			css:{
				src: 'resources/all.css',
				dest: 'resources/public/css/main.min.css'
			}
		},

		shell: {
			rmtmp: {
				command: "rm -rf resources"
			},
			mkresources: {
				command: "mkdir -p resources/public"
			},
			buildjs: {
				command: "lein cljsbuild once prod"
			}
		},

    watch :{
      scripts :{
        files : ["src/html/**/*.html", 'src/js/**/*', "src/css/**/*", "resources/public/js/main.js"], 
        options : {
          livereload : 9090,
        }
      }
    }
  });
	
  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-shell');
	
	grunt.registerTask('clean', ['shell:rmtmp', 'shell:mkresources']);
  grunt.registerTask('heroku', ['clean', 'shell:buildjs', 'concat', 'cssmin']);  
	grunt.registerTask('default', ['heroku']);
};
