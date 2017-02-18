// Compile Pug/Jade templates
var fs = require("fs");

module.exports = {
	main: {
		options: {
			client: false,
			pretty: true
		},
		files: [ {
			cwd: '<%= paths.dev.pug %>/',
			src: ['*.pug'],
			dest: '<%= paths.build.html %>',
			expand: true,
			ext: '.html'
		} ]
	}
}
