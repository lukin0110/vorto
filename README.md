# Vorto.js

[![Build Status](https://travis-ci.org/lukin0110/vorto.svg?branch=master)](https://travis-ci.org/lukin0110/vorto)

Simple module to generate build numbers based on the latest git commit hash. This can be used with 
[Gulp](http://gulpjs.com), or any other build system, when you're creating build artifacts.

## Install
```
$ npm install vorto --save
```

## Usage
```
vorto([format][, options], callback);
```

The `format` and `options` parameters are optional. The last argument must be a callback function of the de facto async
standard `function(err, version) {...}`.

### Formats

```
%h: 4dd41fa
%H: 4dd41fa4656cdbc7ed7d4dba0eeb8056f62c75a2
%ct-%h: 1448966785-4dd41fa
%j: 0.2.1
```

Read more about the [pretty format options](http://git-scm.com/docs/pretty-formats) to see whats available.

### Options

* `repo`: specify the directory of the repository that you want to generate a version code for. The *default* is 
the current directory
* `git`: specify a different path for the `git` command. The *default* is just git.

## Examples

Generate short code:
```js
var vorto = require("vorto");

vorto(function(err, version) {
    console.log("Version: " + version);
});

//Version: 8e0b117
```

Generate long code:
```js
var vorto = require("vorto");

vorto("%H", function(err, version) {
    console.log("Version: " + version);
});

//Version: 271c4461c88bbe3ce11274caa1208ca0e57c1bf1
```

Generate with timestamp and hash:
```js
var vorto = require("vorto");

vorto("%ct-%h", function(err, version) {
    console.log("Version: " + version);
});

//Version: 1448640790-7f562ba
```

Gulp example:
```js
var gulp = require("gulp");
var vorto = require("vorto");

var GIT_VERSION;

gulp.task("version", function(cb) {
    vorto(function(err, version){
        GIT_VERSION = version;
        cb();
    });
});
```

## LICENSE

[The Apache 2.0 License](https://github.com/lukin0110/vorto/blob/master/LICENSE)
