module.exports = function(grunt) {
  "use strict";

  grunt.util.linefeed = '\n';

  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * Indigo Theme v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' */\n\n',

    distPath: "dist",

    clean: {
      dist: ['<%= distPath %>']
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
          'bower_components/bootstrap-select/bootstrap-select.js',
          'bower_components/bootstrap-spinner/dist/bootstrap-spinner.js',
          'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
          'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
          'js/bootstrap.js'
        ],
        dest: '<%= distPath %>/assets/js/lib/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: '<%= distPath %>/assets/js/lib/bootstrap.min.js'
      }
    },

    less: {
      dist: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'style.css.map',
          sourceMapFilename: '<%= distPath %>/assets/css/style.css.map'
        },
        files: {
          '<%= distPath %>/assets/css/style.css': 'less/style.less'
        }
      },
      min: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          '<%= distPath %>/assets/css/style.min.css': '<%= distPath %>/assets/css/style.css'
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        flatten: true,
        src: [
          "fonts/*",
          "bower_components/bootstrap/dist/fonts/*",
          "bower_components/font-awesome/fonts/*"
        ],
        dest: '<%= distPath %>/assets/fonts/'
      },
      img: {
        expand: true,
        src: ["img/**/*"],
        dest: '<%= distPath %>/assets/'
      },
      js: {
        expand: true,
        src: ["js/*", "!js/bootstrap.js"],
        dest: '<%= distPath %>/assets/'
      },
      vendor_js: {
        expand: true,
        flatten: true,
        src: [
          'bower_components/jquery/jquery.min.js',
          'bower_components/jquery/jquery-migrate.min.js',
          'bower_components/datatables/media/js/jquery.dataTables.js',
          'bower_components/html5shiv/dist/html5shiv.js',
          'bower_components/modernizr/modernizr.js',
          'bower_components/moment/min/moment-with-langs.min.js',
          'bower_components/respond/dest/respond.min.js',
        ],
        dest: '<%= distPath %>/assets/js/lib/'
      },
      ckeditor: {
        expand: true,
        cwd: "bower_components/",
        src: [
          "ckeditor/*.js",
          "ckeditor/contents.css",
          "ckeditor/lang/**",
          "ckeditor/plugins/**",
          "ckeditor/skins/**",
        ],
        dest: '<%= distPath %>/assets/js/lib/'
      }
    },

    processhtml: {
      options: {
        recursive: true
      },
      dist: {
        files:[
          {
            expand: true,
            flatten: true,
            src: ['src/*.html'],
            dest: '<%= distPath %>/'
          }
        ]
      },
      admin: {
        files:[
          {
            expand: true,
            flatten: true,
            src: ['src/admin/*.html'],
            dest: '<%= distPath %>/admin/'
          }
        ]
      }
    },

    jsbeautifier: {
      files : '<%= distPath %>/*.html',
    },

    watch: {
      options: { livereload: true },
      less: {
        files: 'less/**/*.less',
        tasks: ['less']
      },
      html: {
        files: 'src/**/*.html',
        tasks: ['html']
      }
    },

    connect: {
      server: {
        options: {
          livereload: true,
          port: 4000,
          base: 'dist',
          hostname: '*',
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('js', ['concat', 'uglify']);

  grunt.registerTask('css', ['less']);

  grunt.registerTask('assets', ['css', 'js', 'copy']);

  grunt.registerTask('html', ['processhtml', 'jsbeautifier']);

  grunt.registerTask('dist', ['clean', 'assets', 'html']);

  grunt.registerTask('default', ['connect', 'watch']);

  grunt.registerTask('deploy', function(env) {
    env = env === undefined ? 'default' : env;

    var deploy = grunt.file.readJSON('deploy.json');

    grunt.config('distPath', deploy[env]);
    grunt.config('clean.dist', deploy[env] + '/assets');

    grunt.task.run(['clean', 'assets']);
  });
};
