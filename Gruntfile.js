module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		path: {
			dist: 'dist',
			asset: 'assets',
			icon: '<%= path.asset %>/icons',
		},
		clean: {
			dist: '<%= path.dist %>',
		},
		less: {
			dist: {
				options: {
					comporess: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'style.css.map',
					sourceMapFilename: '<%= path.dist %>/<%= path.asset %>/css/style.css.map',
					modifyVars: {
						modernizrClass: '<%= modernizr.dist.extensibility.cssclassprefix %>',
					},
				},
				files: {
					'<%= path.dist %>/<%= path.asset %>/css/style.css': 'src/less/style.less',
				},
			},
			minified: {
				options: {
					cleancss: true,
					report: 'min',
				},
				files: {
					'<%= path.dist %>/<%= path.asset %>/css/style.min.css': '<%= path.dist %>/<%= path.asset %>/css/style.css',
				},
			},
		},
		uglify: {
			options: {
				mangle: false,
				report: 'min',
			},
			js: {
				files: [{
					expand: true,
					cwd: 'src/js/',
					src: '**/*.js',
					dest: '<%= path.dist %>/<%= path.asset %>/js/',
					ext: '.min.js',
				}],
			},
			bootstrap_plugins: {
				src: [
					'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
					'bower_components/bootstrap-select/bootstrap-select.js',
					'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
					'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
				],
				dest: '<%= path.dist %>/<%= path.asset %>/js/lib/bootstrap-plugins.min.js',
			},
		},
		copy: {
			assets: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src:['fonts/**', 'img/**', 'js/**'],
						dest:'<%= path.dist %>/<%= path.asset %>/',
					},
				],
			},
			vendor: {
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/jquery/dist/jquery.min.js',
							'bower_components/bootstrap/dist/js/bootstrap.min.js',
							'bower_components/html5shiv/dist/html5shiv.js',
							'bower_components/respond/dest/respond.min.js',
							'bower_components/datatables/media/js/jquery.dataTables.min.js',
							'bower_components/moment/min/moment-with-langs.min.js',
							'bower_components/bootbox/bootbox.js',
						],
						dest: '<%= path.dist %>/<%= path.asset %>/js/lib/',
					},
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/bootstrap/dist/fonts/*',
							'bower_components/font-awesome/fonts/*',
						],
						dest: '<%= path.dist %>/<%= path.asset %>/fonts/',
					},
				],
			},
		},
		processhtml: {
			options: {
				recursive: true,
				process: true,
				data: {
					path: {
						asset: '<%= path.asset %>',
						icon: '<%= path.icon %>',
					},
					modernizrClass: '<%= modernizr.dist.extensibility.cssclassprefix %>',
				},
			},
			dist: {
				files:[
					{
						expand: true,
						flatten: true,
						src: 'src/html/*.html',
						dest: '<%= path.dist %>/',
					},
				],
			},
			admin: {
				files:[
					{
						expand: true,
						flatten: true,
						src: 'src/html/admin/*.html',
						dest: '<%= path.dist %>/admin/',
					},
				],
			},
		},
		jsbeautifier: {
			files : ['<%= path.dist %>/**/*.html'],
		},
		modernizr: {
			dist: {
				devFile: 'bower_components/modernizr/modernizr.js',
				outputFile: '<%= path.dist %>/<%= path.asset %>/js/lib/modernizr.min.js',
				extra: {
					shiv: false,
					mq: true,
					cssclasses: true,
				},
				extensibility: {
					cssclassprefix: '',
				},
				uglify: true,
				tests: [],
				files: {
					src: [
						'<%= path.dist %>/<%= path.asset %>/css/*.css',
						'<%= path.dist %>/<%= path.asset %>/js/*.js',
					],
				},
			},
		},
		watch: {
			options: {
				livereload: false,
			},
			less: {
				files: 'src/less/*.less',
				tasks: 'less',
			},
			html: {
				files: 'src/html/**/*.html',
				tasks: 'processhtml',
			},
			js: {
				files: 'src/js/*.js',
				tasks: 'uglify',
			},
		},
		connect: {
			server: {
				options: {
					livereload: true,
					port: 9000,
					base: '<%= path.dist %>',
				},
			},
		},
	});

	require('load-grunt-tasks')(grunt);

	// Task definition
	grunt.registerTask('assets', ['less', 'uglify', 'copy', 'modernizr']);
	grunt.registerTask('html', ['processhtml', 'jsbeautifier']);
	grunt.registerTask('dist', ['clean', 'assets', 'html']);
	grunt.registerTask('work', ['connect', 'watch']);
	grunt.registerTask('default', 'dist');
};
