# grunt-pylint [![Build Status](https://travis-ci.org/thusoy/grunt-pylint.png?branch=automated-tests)](https://travis-ci.org/thusoy/grunt-pylint)

> Validate python code with pylint.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pylint --save-dev
```

**Note**: Installation requires the python package manager `pip` to be in your `$PATH` ([installation instructions](https://pip.pypa.io/en/stable/installing/)) (it does not however, require networking -- all dependencies are bundled with the source)

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pylint');
```

## The "pylint" task

### Overview
In your project's Gruntfile, add a section named `pylint` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  pylint: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### disable
Type: `String` or `Array`  

Messages to disable, either by category (like `C` for convention), by ID (like `C0103`) or by symbolic name (like `invalid-name`).

#### enable
Type: `String` or `Array`  

Messages to enable, either by category, ID or symbolic name.

#### errorsOnly
Type: `Boolean`  
Default: `false`

Only report on error messages.

#### externalPylint
Type `Boolean`  
Default: `false`

Use pylint modules from python interpreter in path.

#### force
Type: `Boolean`  
Default: `false`

Never fail the task.

#### ignore
Type: `String` or `Array`  

Files or directories to ignore. Must be basenames, not paths.

#### initHook
Type: `String`  

Python code to execute before running pylint. This will be executed in the same python interpreter as pylint, and can thus be used to modify the python path before execution, or similar.

#### messageTemplate
Type: `String`  
Default: `"short"`

A string specifying how to format the output messages. Should be a string something like this: `{msg_id}, line {line}: {msg}`. This string will be formatted using regular new-style python formatting, see the documentation for this here: http://docs.python.org/2/library/string.html#format-specification-mini-language

Available fields you can insert into the output is:

- `msg_id`: The ID of the message, like `W0103`.
- `abspath`: The absolute path to the module where the error was found
- `module`: The name of module, like `package.my_module.py`.
- `obj`: The name of the object where the error was found, like MyObject or my_func.
- `line`: The line number of the error.
- `column`: Column number of the error.
- `path`: Path to the module with the error.
- `msg`: The actual error message.
- `C`: (capital C) The first letter of the message category.
- `category`: The category of the message, either Info, Refactor, Convention, Warning, Error or Fatal.
- `symbol`: The symbolic name of the message, like `unused-variable` for `W0612`.

Some aliases also exist:

- `parseable`: `"{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}"` (this is often the one supported by external tools that read pylint output)
- `msvs`: `"{path}({line}): [{msg_id}({symbol}){obj}] {msg}"` The format read by Visual Studio.
- `short`: `"line {line}: {msg} ({symbol})"` This is the default.

#### outputFile
Type: `String`  

A file to save the output to.

#### outputFormat
Type: `String`  
Alternatives: `text|colorized`
Default: `"colorized"`

What format the output will be in.

#### rcfile
Type: `String`  

A path to a rcfile to use. Messages to enable or disable given in `options.enable` and `options.disable` will override anything given in the rcfile.

#### report
Type: `Boolean`  
Default: `false`

Whether to include a full report or just the messages.

#### virtualenv
Type: `String`  

A path to a virtualenv to use when linting.

### Usage Examples

#### Default Options
In the simplest case, use all the default pylint options:

```js
grunt.initConfig({
  pylint: {
    dist: {
      src: 'mypackage',
    }
  }
})
```

#### Custom Options
In this example, use a rcfile to specify checks to enable and disable, with overrides for one package.

```js
grunt.initConfig({
  pylint: {
    options: {
      rcfile: '.pylintrc',
    },
    src_package: {
      src: 'mypackage',
    },
    tests: {
      src: 'test',
      options: {
        disable: 'missing-docstring',
      }
    }
  },
})
```

## Contributing

The python dependencies of pylint is bundled with the package as published on npm, but is not present directly in the repository. Thus, to be able to contribute to this project, do the following:

1. Fork the project
2. Clone it locally
3. Run `npm run devsetup` to download the python dependencies (requires pip)
4. Run `npm install` to install the node dependencies
5. Write a test if possible and fix the issue you're having
6. Verify that tests pass with `grunt test`

If you want to test your fixes in another project, do steps 1-3 and then run `npm link <path-to-your-local-clone>` in the other project.

To ensure that the npm package works out of the box on all systems, the source distribution of the python dependencies are included and installed into tasks/lib by pip in the `postinstall` phase. This means pip is required on the system installing the package, but that seems a fair assumption for python projects.

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/).

## Changelog

### Unreleased
Remove support for python 3.3.

### v1.3.1 (2016-03-10)
Add compatibility with pip < 1.5

### v1.3.0 (2016-02-20)
Update bundled pylint to 1.5.4

### v1.2.1 (2016-02-20)
Make compatible with grunt 1.0

### v1.2.0 (2015-03-18)
Add initHook option

### v1.1.0 (2015-03-10)
Update bundled pylint to 1.4.1

### v1.0.0 (2014-11-13)
Add support for python 3

### v0.4.0 (2014-03-01)
Use python exec from virtualenv

### v0.3.0 (2014-01-26)
Add option externalPylint and automate testing

### v0.2.0 (2014-01-23)
Bump pylint to 1.1

### v0.1.1 (2013-09-21)
Properly escape all color codes

### v0.1.0 (2013-09-19)
Initial release.
