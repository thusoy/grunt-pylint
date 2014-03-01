'use strict';

var fs = require('fs');

// Read the report as lines
exports.readReport = function (reportName, callback) {
  fs.readFile('reports/' + reportName + '.out', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].trim();
    }
    // remove blank lines from the end
    while (lines.length && !lines[lines.length - 1]) {
      lines.pop();
    }
    callback(lines);
  });
};
