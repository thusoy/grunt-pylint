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

  grunt.registerMultiTask('pylint', 'Run all python code through pylint', function(){
    var done = this.async();

    var options = this.options({
      'disable': [],
      'enable': [],
      'errorsOnly': false,
      'ignore': [],
      'includeIds': true,
      'outputFormat': 'text',
      'rcfile': null,
      'report': false,
      'symbolicIds': false,
    });

    var pylintPath = path.join(__dirname, 'lib');
    var baseArgs = [
      '-c',
      'import sys; sys.path.insert(0, r"'+pylintPath+'"); from colorama import init; init(); import pylint; pylint.run_pylint()'
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

    var outputFormat = options.outputFormat;
    delete options.outputFormat;

    if (outputFormat){
      baseArgs.push('--output-format=' + outputFormat);
    }

    var includeIds = options.includeIds;
    delete options.includeIds;

    if (includeIds){
      baseArgs.push('--include-ids=y');
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

    var symbolicIds = options.symbolicIds;
    delete options.symbolicIds;

    if (symbolicIds){
      baseArgs.push('--symbols=y');
    }

    for(var prop in options){
      if (options.hasOwnProperty(prop)){
        grunt.fail.warn("Unknown option to pylint: '" + prop + "'");
      }
    }

    var noFailures = true;
    var runsRemaining = this.filesSrc.length;

    this.filesSrc.forEach(function(module_or_package){

      var args = baseArgs.slice(0);
      args.push(module_or_package);

      grunt.log.verbose.writeln('Running pylint with args: ' + args.join(" "));

      // Spawn the pylint subprocess
      grunt.util.spawn({
        'cmd': 'python',
        'args': args,
        'opts': {
          'stdio': 'inherit',
        },
      }, function(error, result, code){
        if (code === 0){
          grunt.log.ok("No lint in " + module_or_package);
        } else {
          noFailures = false;
        }
        runsRemaining -= 1;
        if (runsRemaining === 0){
          done(noFailures);
        }
      });
    });

  });

};
