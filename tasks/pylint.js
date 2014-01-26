/*
 * grunt-pylint
 * https://github.com/tarjei/grunt-pylint
 *
 * Copyright (c) 2013 Tarjei Husøy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');

  // Use our own uncolor func since grunt.log.uncolor doesnt support codes of the
  // format [7;33m (only [7m and the likes) which is how pylint outputs module headers
  var uncolor = function(str) {
    return str.replace(/\x1B\[\d+[;\d]*m/g, '');
  };

  var getVirtualenvActivationCode = function(virtualenv){
    var activateThisPath;
    var activeThisPathAlternatives = [
      // *nix activate_this path:
      path.join(virtualenv, 'bin', 'activate_this.py'),
      // windows style path:
      path.join(virtualenv, 'Scripts', 'activate_this.py'),
    ];
    grunt.util._.forEach(activeThisPathAlternatives, function(path){
      if (grunt.file.exists(path)){
        activateThisPath = path;
        return false; // stops iteration
      }
    });
    if (activateThisPath === undefined){
      grunt.fail.warn('Tried to activate virtualenv "' + virtualenv + '", but did not ' +
        'find the file "activate_this.py" required for activation, after trying ' +
        'these locations:\n' + activeThisPathAlternatives.join("\n") +
        '\nMake sure this file exist at either of these locations, and try again.');
    }
    var activationCode = 'execfile(r"' + activateThisPath + '", ' +
      'dict(__file__=r"' + activateThisPath + '"))';

    return activationCode;
  };


  var buildBaseArgs = function(options){
    // Build the base argument list sent to python from the options object

    var pylintPath = path.join(__dirname, 'lib');

    var externalPylint = options.externalPylint;
    delete options.externalPylint;

    var virtualenv = options.virtualenv;
    delete options.virtualenv;

    var activateVirtualenv = "pass";
    if (virtualenv){
      activateVirtualenv = getVirtualenvActivationCode(virtualenv);
    }

    var pythonCode = [
      activateVirtualenv,
    ];

    if (!externalPylint) {
      pythonCode.push('import sys; sys.path.insert(0, r"'+pylintPath+'")');
    }

    pythonCode.push('import pylint', 'pylint.run_pylint()');

    var baseArgs = [
      '-c',
      pythonCode.join("; ")
    ];

    var enable = options.enable;
    delete options.enable;

    if (enable){
      baseArgs.push('--enable=' + enable);
    }

    var disable = options.disable;
    delete options.disable;

    if (disable){
      baseArgs.push('--disable=' + disable);
    }

    var messageTemplate = options.messageTemplate;
    delete options.messageTemplate;

    if (messageTemplate){
      var aliases = {
        'short': "line {line}: {msg} ({symbol})",
        'msvs': "{path}({line}): [{msg_id}({symbol}){obj}] {msg}",
        'parseable': "{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}",
      };
      if (aliases[messageTemplate] !== undefined){
        baseArgs.push('--msg-template="' + aliases[messageTemplate] + '"');
      } else {
        baseArgs.push('--msg-template="' + messageTemplate + '"');
      }
    }

    var outputFormat = options.outputFormat;
    delete options.outputFormat;

    if (outputFormat){
      baseArgs.push('--output-format=' + outputFormat);
    }

    var report = options.report;
    delete options.report;

    if (report){
      baseArgs.push('--report=yes');
    } else {
      baseArgs.push('--report=no');
    }

    var rcfile = options.rcfile;
    delete options.rcfile;

    if (rcfile){
      baseArgs.push('--rcfile=' + rcfile);
    }

    var errorsOnly = options.errorsOnly;
    delete options.errorsOnly;

    if (errorsOnly){
      baseArgs.push('--errors-only');
    }

    var ignore = options.ignore;
    delete options.ignore;

    if (ignore){
      baseArgs.push('--ignore=' + ignore);
    }

    // Fail if there's any options remaining now
    for(var prop in options){
      if (options.hasOwnProperty(prop)){
        grunt.fail.warn("Unknown option to pylint: '" + prop + "'");
      }
    }

    return baseArgs;
  };

  grunt.registerMultiTask('pylint', 'Run all python code through pylint', function(){
    var done = this.async();

    var options = this.options({
      errorsOnly: false,
      force: false,
      outputFormat: 'colorized',
      messageTemplate: 'short',
      report: false,
      externalPylint: false,
    });

    var force = options.force;
    delete options.force;

    // Capture task stdout for writing to file later
    var output = "";
    var outputFile = options.outputFile;
    delete options.outputFile;

    var baseArgs = buildBaseArgs(options);

    var noFailures = true;

    // pylint only supports running against a single module or package at a time,
    // so we haave to trigger it several times if we have several targets
    var runsRemaining = this.filesSrc.length;

    this.filesSrc.forEach(function(module_or_package){

      var args = baseArgs.slice(0);
      args.push(module_or_package);

      grunt.log.verbose.writeln('Running pylint with args: ' + args.join(" "));

      // Spawn the pylint subprocess
      grunt.util.spawn({
        'cmd': 'python',
        'args': args,
      }, function(error, result, code){

        var stdout = grunt.option('no-color') ? uncolor(result.stdout) : result.stdout;
        grunt.log.writeln(stdout);
        output += result.stdout + '\n';

        if (code === 0){
          grunt.log.ok("No lint in " + module_or_package);
        } else {
          grunt.log.verbose.writeln("Stderr from pylint: " + result.stderr);
          noFailures = false;
          if (force){
            grunt.log.warn("Linting errors found, but `force` was used, continuing...");
          }
        }

        runsRemaining -= 1;
        if (runsRemaining === 0){
          if (outputFile){
            var uncoloredOutput = uncolor(output);
            grunt.file.write(outputFile, uncoloredOutput);
            grunt.log.ok("Results written to " + outputFile);
          }
          done(noFailures || force);
        }
      });

    });

  });

};
