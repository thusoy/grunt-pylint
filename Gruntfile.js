/*
 * grunt-pylint
 * https://github.com/tarjei/grunt-pylint
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Load plugins defined in package.json
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      unecessaryPythonStuff: [
        'tasks/lib/*.egg-info',
      ],
      testResults: [
        'reports',
      ],
      compiledStuff: [
        'tasks/lib/**/*.pyc',
      ],
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'Release v<%= version %>',
      }
    },

    // Configuration to be run (and then tested).
    pylint: {
      options: {
        outputFile: 'reports/<%= grunt.task.current.target %>.out',
        force: true,
      },
      rcfile: {
        options: {
          rcfile: 'test/ignore_invalid_name.pylintrc',
        },
        src: ['test/fixtures/test_package'],
      },
      disable: {
        options: {
          disable: ['unused-variable'],
        },
        src: ['test/fixtures/test_package']
      },
      combined: {
        options: {
          rcfile: 'test/ignore_invalid_name.pylintrc',
          disable: ['unused-variable'],
        },
        src: ['test/fixtures/test_package'],
      },
      errorsOnly: {
        options: {
          errorsOnly: true,
        },
        src: ['test/fixtures/test_package', 'test/fixtures/test_venv.py'],
      },
      ignore: {
        options: {
          ignore: 'unusedvariable.py',
        },
        src: 'test/fixtures/test_package',
      },
      multipleSrcFiles: {
        src: [
          'test/fixtures/test_package/camelcasefunc.py',
          'test/fixtures/test_package/unusedvariable.py',
        ],
      },
      virtualenv: {
        options: {
          virtualenv: 'test/test_virtualenv',
        },
        src: 'test/fixtures/test_venv.py',
      },
      virtualenvWin: {
        options: {
          virtualenv: 'test/test_virtualenv_win',
        },
        src: 'test/fixtures/test_venv.py',
      },
      messageTemplate: {
        options: {
          messageTemplate: '{line}: {msg}',
        },
        src: 'test/fixtures/test_package',
      },
      HTMLOutput: {
        options: {
          outputFormat: 'html',
        },
        src: 'test/fixtures/test_package',
      },
      taskOverridesRc: {
        options: {
          rcfile: 'test/ignore_invalid_name.pylintrc',
          enable: 'invalid-name',
          disable: 'unused-variable',
        },
        src: 'test/fixtures/test_package',
      },
      templateAliases: {
        options: {
          messageTemplate: 'parseable',
        },
        src: 'test/fixtures/test_package',
      },
      report: {
        options: {
          report: true,
        },
        src: 'test/fixtures/test_package',
      },
      externalPylint: {
        options: {
          externalPylint: true,
          virtualenv: 'test/test_virtualenv_with_pylint',
        },
        src: 'test/fixtures/test_package',
      },
    },

    nodeunit: {
      all: ['test/test_reports.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('test', ['clean', 'pylint', 'nodeunit']);
  grunt.registerTask('publish', ['clean', 'release']);
};
