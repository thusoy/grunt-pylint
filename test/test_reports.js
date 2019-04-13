'use strict';

var testutils = require('./testutils.js');
var fs = require('fs');

exports.testMsgTemplate = function (test) {
  test.expect(2);
  testutils.readReport('messageTemplate', function (lines) {
    test.equal(lines.length, 4);
    test.ok(lines.indexOf('3: Invalid function name "camelCaseFunc"') > 0);
    test.done();
  });
};

exports.testRcfile = function (test) {
  test.expect(2);
  testutils.readReport('rcfile', function (lines) {
    test.equal(lines.length, 2);
    test.equal(lines[1], "line 5: Unused variable 'unused' (unused-variable)");
    test.done();
  });
};

exports.testDisable = function (test) {
  test.expect(2);
  testutils.readReport('disable', function (lines) {
    test.equal(lines.length, 2);
    test.equal(lines[1], 'line 3: Invalid function name "camelCaseFunc" (invalid-name)');
    test.done();
  });
};

exports.testEmptyReports = function (test) {
  var emptyReportTargets = [
    'combined',
    'errorsOnly',
  ];
  var reportsTested = 0;
  test.expect(emptyReportTargets.length);
  var testEmpty = function (lines) {
    test.equal(lines.length, 0, "Found a report that should have been empty but wasn't!");
    reportsTested++;
    if (reportsTested === emptyReportTargets.length) {
      test.done();
    }
  };
  for (var i = 0; i < emptyReportTargets.length; i++) {
    testutils.readReport(emptyReportTargets[i], testEmpty);
  }
};

exports.testIgnore = function (test) {
  test.expect(2);
  testutils.readReport('ignore', function (lines) {
    test.equal(lines.length, 2);
    test.equal(lines[1], 'line 3: Invalid function name "camelCaseFunc" (invalid-name)');
    test.done();
  });
};

exports.testMultipleSrcFiles = function (test) {
  test.expect(1);
  testutils.readReport('multipleSrcFiles', function (lines) {
    test.equal(lines.length, 4);
    // order of output is indeterministic when specifying multiple files, but with a length of 4
    // we know that we found linting errors in both modules
    test.done();
  });
};

exports.testHTMLOutput = function (test) {
  test.expect(1);
  testutils.readReport('HTMLOutput', function (lines) {
    test.equal(lines[0], '<html>');
    test.done();
  });
};

exports.testInitHook = function (test) {
  test.expect(1);
  // Should have created this file
  fs.readFile('inithooktest', function (path, data) {
    test.equal(data, 'testdata');
    test.done();
  });
};

exports.testTaskConfigOverridesRcfile = function (test) {
  test.expect(2);
  testutils.readReport('taskOverridesRc', function (lines) {
    test.equal(lines.length, 2);
    test.equal(lines[1], 'line 3: Invalid function name "camelCaseFunc" (invalid-name)');
    test.done();
  });
};

exports.testTemplateAliases = function (test) {
  test.expect(2);
  testutils.readReport('templateAliases', function (lines) {
    // if on windows, make sure to use unix style slashes for the test
    for (var i = 0; i < 4; i++) {
      while (lines[i].indexOf('\\') > 0) {
        lines[i] = lines[i].replace('\\', '/');
      }
    }
    test.equal(lines.length, 4);
    test.ok(lines.indexOf('test/fixtures/test_package/camelcasefunc.py:3: ' +
      '[C0103(invalid-name), camelCaseFunc] Invalid function name "camelCaseFunc"') > 0);
    test.done();
  });
};

exports.testReport = function (test) {
  test.expect(3);
  testutils.readReport('report', function (lines) {
    test.ok(lines.length > 10);
    test.ok(lines.indexOf('line 3: Invalid function name "camelCaseFunc" (invalid-name)') > 0);
    test.equal(lines[6], 'Report');
    test.done();
  });
};

exports.testScore = function (test) {
  test.expect(2);
  testutils.readReport('score', function (lines) {
    test.equal(lines.length, 7);
    test.ok(lines[6].startsWith('Your code has been rated at 5.00/10'));
    test.done();
  });
};
