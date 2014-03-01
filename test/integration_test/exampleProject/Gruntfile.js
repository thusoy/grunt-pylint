module.exports = function(grunt) {

  grunt.initConfig({

    pylint: {

      options: {
        outputFile: 'reports/<%= grunt.task.current.target %>.out',
        force: true,
      },

      exampleProject: {
        src: 'test_module.py'
      },

      virtualenv: {
        options: {
          virtualenv: 'venv',
        },
        src: 'test_module.py',
      },

      externalPylint: {
        options: {
          externalPylint: true,
          virtualenv: 'venv',
        },
        src: 'test_module.py',
      },

    },

    nodeunit: {
      all: ['test_integration_reports.js'],
    }

  });

  grunt.loadNpmTasks('grunt-pylint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

};
