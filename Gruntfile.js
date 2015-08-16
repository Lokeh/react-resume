// grunt config

module.exports = function(grunt) {

	grunt.initConfig({
		browserify: {
			libs: {
				src: ['.'],
				dest: 'dist/js/libs.js',
				options: {
					alias: ['react:', 'bluebird:', 'immutable:', 'material-ui:', 'react-tap-event-plugin:']
				}
			},
			app: {
				src: ['src/js/init.jsx'],
				dest: 'dist/js/app.js',
				options: {
					watch: true,
					keepAlive: true,
					external: ['react', 'bluebird', 'immutable', 'material-ui', 'react-tap-event-plugin']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', ['browserify']);

};
