var testutils = require('./testutils.js');

exports.testExampleProject = function (test) {
  test.expect(2);
  testutils.readReport('exampleProject', function(lines){
    test.equal(lines.length, 2);
    test.equal(lines[1], "line 4: Unable to import 'venv_exclusive' (import-error)");
    test.done();
  });
};

exports.testVirtualenv = function (test) {
  test.expect(1);
  testutils.readReport('virtualenv', function (lines) {
    test.equals(lines.length, 0);
    test.done();
  });
};

exports.testExternalPylint = function (test) {
  test.expect(2);
  testutils.readReport('externalPylint', function(lines){
    test.equal(lines.length, 2);
    test.equal(lines[1], "line 4: Unable to import 'venv_exclusive' (import-error)");
    test.done();
  });
};
