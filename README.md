# grunt-pylint

> Validate python code with pylint.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pylint --save-dev
```

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

Messages to enable, either by category or by ID.

#### errorsOnly
Type: `Boolean`  
Default: `false`

Only report on error messages.

#### force
Type: `Boolean`  
Default: `false`

Never fail the task.

#### ignore
Type: `String` or `Array`  

Files or directories to ignore. Must be basenames, not paths.

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
- `C`: (captial C) The first letter of the message category.
- `category`: The category of the message, either Info, Refactor, Convention, Warning, Error or Fatal.
- `symbol`: The symbolic name of the message, like `unused-variable` for `W0612`.

Some aliases also exist:

- `parseable`: `"{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}"` (this is often the one supported by external tools that read pylint output)
- `msvs`: `"{path}({line}): [{msg_id}({symbol}){obj}] {msg}"` The format read by Visual Studio.
- `short`: `"line {line}: {msg} ({symbol})"` This is the default.

#### outputFile
Type: `String`  
Default: `null`

A file to save the output to.

#### outputFormat
Type: `String`  
Alternatives: `text|colorized|html`
Default: `"colorized"`

What format the output will be in. Specifying `options.outputFormat = "html"` will ignore anything set by `options.messageFormat`.

#### rcfile
Type: `String`  
Default: `null`

A path to a rcfile to use. Messages to enable or disable given in `options.enable` and `options.disable` will override anything given in the rcfile.

#### report
Type: `Boolean`  
Default: `true`

Whether to include a full report or just the messages.

#### symbolicIds
Type: `Boolean`  
Default: `false`

Whether to include a symbolic name of each message in the output.

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
        disable: 'C0111', # missing docstring
      }
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/). To get the pylint library, run `npm run-script prepublish`. This requires that you have pip installed.

## Release History
_(Nothing yet)_
