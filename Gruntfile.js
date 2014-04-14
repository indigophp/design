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
      dist: {
        src: [
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
          'bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.hu.js',
          'bower_components/bootstrap-select/bootstrap-select.js',
          'bower_components/bootstrap-spinner/dist/bootstrap-spinner.js',
          'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
          'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js'
        ],
        dest: '<%= distPath %>/assets/js/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= distPath %>/assets/js/bootstrap.min.js'
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
      vendor_js: {
        expand: true,
        flatten: true,
        src: [
          'bower_components/jquery/jquery.min.js',
          'bower_components/jquery/jquery-migrate.min.js',
          'bower_components/html5shiv/dist/html5shiv.js',
          'bower_components/respond/dest/respond.min.js'
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
        files: 'less/*.less',
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

  grunt.registerTask('html', ['processhtml', 'jsbeautifier']);

  grunt.registerTask('dist', ['clean', 'css', 'js', 'html', 'copy']);

  grunt.registerTask('default', ['connect', 'watch']);
};
