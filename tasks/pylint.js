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

    if (options.enable){
      baseArgs.push('--enable=' + options.enable);
    }
    if (options.disable){
      baseArgs.push('--disable=' + options.disable);
    }
    if (options.outputFormat){
      baseArgs.push('--output-format=' + options.outputFormat);
    }
    if (options.includeIds){
      baseArgs.push('--include-ids=y');
    }
    if (options.report){
      baseArgs.push('--report=yes');
    } else {
      baseArgs.push('--report=no');
    }
    if (options.rcfile){
      baseArgs.push('--rcfile=' + options.rcfile);
    }
    if (options.errorsOnly){
      baseArgs.push('--errors-only');
    }
    if (options.ignore){
      baseArgs.push('--ignore=' + options.ignore);
    }
    if (options.symbolicIds){
      baseArgs.push('--symbols=y');
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
