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

  var buildBaseArgs = function(options){
    // Build the base argument list sent to python from the options object

    var pylintPath = path.join(__dirname, 'lib');

    var baseArgs = [
      '-c',
      [
        'import sys',
        'sys.path.insert(0, r"'+pylintPath+'")',
        'import pylint',
        'pylint.run_pylint()',
      ].join("; "),
    ];

    var enable = "" + options.enable;
    delete options.enable;

    if (enable){
      baseArgs.push('--enable=' + enable);
    }

    var disable = "" + options.disable;
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

    var ignore = "" + options.ignore;
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
      'disable': [],
      'enable': [],
      'errorsOnly': false,
      'force': false,
      'ignore': [],
      'outputFile': null,
      'outputFormat': 'colorized',
      'messageTemplate': 'short',
      'rcfile': null,
      'report': false,
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

        grunt.log.writeln(result.stdout);
        output += result.stdout;

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
            var uncoloredOutput = grunt.log.uncolor(output);
            grunt.file.write(outputFile, uncoloredOutput);
            grunt.log.ok("Results written to " + outputFile);
          }
          done(noFailures || force);
        }
      });

    });

  });

};
