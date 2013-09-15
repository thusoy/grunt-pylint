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
      'ignore': [],
      'enable': [],
      'disable': [],
      'report': false,
      'includeIds': true,
      'errorsOnly': false,
      'symbolicIds': false,
    });
    var args = [];
    if (options.enable){
      args.push('--enable=' + options.enable);
    }
    if (options.disable){
      args.push('--disable=' + options.disable);
    }
    if (options.outputFormat){
      args.push('--output-format=' + options.outputFormat);
    }
    if (options.includeIds){
      args.push('--include-ids=y');
    }
    if (options.report){
      args.push('--report=yes');
    } else {
      args.push('--report=no');
    }
    if (options.rcfile){
      args.push('--rcfile=' + options.rcfile);
    }
    if (options.errorsOnly){
      args.push('--errors-only');
    }
    if (options.ignore){
      args.push('--ignore=' + options.ignore);
    }
    if (options.symbolicIds){
      args.push('--symbols=y');
    }

    args.push(this.filesSrc);

    var pylintPath = path.join(__dirname, 'bin');
    grunt.log.verbose.write('Pylintpath: ' + pylintPath);

    grunt.log.verbose.write('Running pylint with args: ' + args);
    // Trigger the pylint subprocess
    grunt.util.spawn({
      'cmd': 'python',
      'args': ['-c', 'import sys; sys.path.insert(0, r"'+pylintPath+'"); import pylint; pylint.run_pylint()'].concat(args),
      'opts': {
        'stdio': 'inherit',
      },
    }, function(error, result, code){
      if (code === 0){
        grunt.log.ok("No python lint found.");
      }
      done(code === 0);
    });

  });

};
