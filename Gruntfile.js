// grunt config

module.exports = function(grunt) {

	grunt.initConfig({
		browserify: {
			app: {
				src: ['src/js/**/*'],
				dest: 'dist/js/app.js',
				options: {
					watch: true,
					keepAlive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', ['browserify']);

};
