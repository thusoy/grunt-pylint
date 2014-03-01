/*
 * grunt-pylint
 * https://github.com/tarjei/grunt-pylint
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var path = require('path');

  // Use our own uncolor func since grunt.log.uncolor doesnt support codes of the
  // format [7;33m (only [7m and the likes) which is how pylint outputs module headers
  var uncolor = function (str) {
    return str.replace(/\x1B\[\d+[;\d]*m/g, '');
  };

  // Get the path to the python executable, using the options.virtualenv parameter.
  // Will remove the virtualenv parameter from the options object if present
  function getPythonExecutable(options, platform) {
    if (options.virtualenv) {
      var isWin = /^win/.test(platform);
      var pythonExec = isWin ?
        path.join(options.virtualenv, 'Scripts', 'python.exe') :
        path.join(options.virtualenv, 'bin', 'python');
      delete options.virtualenv;
      return pythonExec;
    } else {
      return 'python';
    }
  }

  // Get the python code that will import and execute pylint
  // Uses the options.externalPylint parameter to determine whether to use the pylint included
  // with the plugin or an external one. externalPylint is deleted from the options object.
  function getPythonCode(options) {
    var pythonCode = [],
        internalPylint = !options.externalPylint,
        pylintPath = path.join(__dirname, 'lib');

    if (internalPylint) {
      pythonCode.push('import sys', 'sys.path.insert(0, r"' + pylintPath + '")');
    }

    pythonCode.push('import pylint', 'pylint.run_pylint()');
    delete options.externalPylint;
    return pythonCode.join('; ');
  }

  // Build the argument list sent to pylint from the options object
  var buildPylintArgs = function (options) {
    var pylintArgs = [];

    var enable = options.enable;
    delete options.enable;

    if (enable) {
      pylintArgs.push('--enable=' + enable);
    }

    var disable = options.disable;
    delete options.disable;

    if (disable) {
      pylintArgs.push('--disable=' + disable);
    }

    var messageTemplate = options.messageTemplate;
    delete options.messageTemplate;

    if (messageTemplate) {
      var aliases = {
        'short': "line {line}: {msg} ({symbol})",
        'msvs': "{path}({line}): [{msg_id}({symbol}){obj}] {msg}",
        'parseable': "{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}",
      };
      if (aliases[messageTemplate] !== undefined) {
        pylintArgs.push('--msg-template="' + aliases[messageTemplate] + '"');
      } else {
        pylintArgs.push('--msg-template="' + messageTemplate + '"');
      }
    }

    var outputFormat = options.outputFormat;
    delete options.outputFormat;

    if (outputFormat) {
      pylintArgs.push('--output-format=' + outputFormat);
    }

    var report = options.report;
    delete options.report;

    if (report) {
      pylintArgs.push('--report=yes');
    } else {
      pylintArgs.push('--report=no');
    }

    var rcfile = options.rcfile;
    delete options.rcfile;

    if (rcfile) {
      pylintArgs.push('--rcfile=' + rcfile);
    }

    var errorsOnly = options.errorsOnly;
    delete options.errorsOnly;

    if (errorsOnly) {
      pylintArgs.push('--errors-only');
    }

    var ignore = options.ignore;
    delete options.ignore;

    if (ignore) {
      pylintArgs.push('--ignore=' + ignore);
    }

    // Fail if there's any options remaining now
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        grunt.fail.warn("Unknown option to pylint: '" + prop + "'");
      }
    }

    return pylintArgs;
  };

  grunt.registerMultiTask('pylint', 'Run all python code through pylint', function () {
    /* This task converts the options given in the task to command line arguments, and runs pylint.
    *
    * This is done by first finding the python executable (from virtualenv if specified, else from
    * path), build some python code to import and execute pylint, and then pass the pylint
    * arguments in the following manner:
    *
    *   $ python -c "<import and execute pylint>" <pylint-arg-1> <pylint-arg-2> ...
    */
    var done = this.async();

    var options = this.options({
      errorsOnly: false,
      force: false,
      outputFormat: 'colorized',
      messageTemplate: 'short',
      report: false,
      externalPylint: false,
    });

    var pythonExecutable = getPythonExecutable(options, process.platform);
    var pythonCode = getPythonCode(options);

    var force = options.force;
    delete options.force;

    // Capture task stdout for writing to file later
    var output = "";
    var outputFile = options.outputFile;
    delete options.outputFile;


    var pylintArgs = buildPylintArgs(options);

    var noFailures = true;

    // pylint only supports running against a single module or package at a time,
    // so we haave to trigger it several times if we have several targets
    var runsRemaining = this.filesSrc.length;

    this.filesSrc.forEach(function (moduleOrPackage) {

      var args = ['-c', pythonCode].concat(pylintArgs, moduleOrPackage);

      grunt.log.verbose.writeln('Executing with python at: ' + pythonExecutable +
        ', and arguments: ' + args.join(' '));

      // Spawn the pylint subprocess
      var pylint = grunt.util.spawn({
        'cmd': pythonExecutable,
        'args': args,
      }, function (error, result, code) {

        var stdout = grunt.option('no-color') ? uncolor(result.stdout) : result.stdout;
        grunt.log.writeln(stdout);
        output += result.stdout + '\n';

        if (code === 0) {
          grunt.log.ok("No lint in " + moduleOrPackage);
        } else {
          grunt.log.verbose.writeln("Stderr from pylint: " + result.stderr);
          noFailures = false;
          if (force) {
            grunt.log.warn("Linting errors found, but `force` was used, continuing...");
          }
        }

        runsRemaining -= 1;
        if (runsRemaining === 0) {
          if (outputFile) {
            var uncoloredOutput = uncolor(output);
            grunt.file.write(outputFile, uncoloredOutput);
            grunt.log.ok("Results written to " + outputFile);
          }
          done(noFailures || force);
        }
      });

      pylint.on('error', function (err) {
        grunt.log.error("Running pylint failed with the following error: " + err);
        grunt.log.error("I tried to launch this python: " + pythonExecutable + ", " +
          'with the following arguments: -c "' + pythonCode + '"' + args.slice(2).join(" "));
      });

    });

  });

};
