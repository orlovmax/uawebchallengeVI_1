// Concatenate files.
module.exports = {
	main: {
		files: [{
			'<%= paths.build.js %>/body.min.js': '<%= paths.dev.js %>/body.js',
			'<%= paths.build.js %>/ie.min.js': '<%= paths.dev.js %>/ie.js'
		}]
	}
}
