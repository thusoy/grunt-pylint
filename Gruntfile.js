/*
 * grunt-pylint
 * https://github.com/tarjei/grunt-pylint
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      unecessaryPythonStuff: [
        'tasks/bin/*.egg-info',
      ],
    },

    // Configuration to be run (and then tested).
    pylint: {
      rcfile: {
        options: {
          rcfile: 'test/ignore_both',
        },
        src: ['test/fixtures/test_package'],
      },
      gruntConfig: {
        options: {
          disable: ['C0103', 'W0612'],
        },
        src: ['test/fixtures/test_package']
      },
      combined: {
        options: {
          rcfile: 'test/ignore_invalid_name',
          disable: ['W0612'],
        },
        src: ['test/fixtures/test_package'],
      },
      errorsOnly: {
        options: {
          errorsOnly: true,
        },
        src: 'test/fixtures/test_package',
      },
      ignore: {
        options: {
          ignore: 'unusedvariable.py',
        },
        src: 'test/fixtures/test_package',
      },
      multiFile: {
        options: {
          disable: ['C0103', 'C0111', 'W0612'],
        },
        src: ['test/fixtures/test_package', 'test/fixtures/missing_docstring.py'],
      },
      shouldFail_colorized: {
        options: {
          outputFormat: 'colorized',
        },
        src: 'test/fixtures/test_package',
      },
      shouldFail_task_override_rc: {
        options: {
          rcfile: 'test/ignore_both',
          enable: 'C0103',
        },
        src: 'test/fixtures/test_package',
      },
      shouldFail_parseableOutput: {
        options: {
          outputFormat: 'parseable',
        },
        src: 'test/fixtures/test_package',
      },
      shouldFail_symbolicIds: {
        options: {
          symbolicIds: true,
        },
        src: 'test/fixtures/test_package',
      },
      shouldFail_colored: {
        options: {
          outputFormat: 'colorized',
        },
        src: 'test/fixtures/test_package',
      },
      shouldFail_default: {
        src: 'test/fixtures/test_package',
      }

    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'pylint']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
