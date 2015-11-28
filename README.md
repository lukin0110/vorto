# Vorto.js

Simple module to generate a version code based on the latest git commit hash of a repository. This can be used with 
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

Read more about the [pretty format options](http://git-scm.com/docs/pretty-formats) to see whats available.

## Options

* `repo`: specify the directory of the repository that you want to generate a version code for. The *default* is 
the current directory

## LICENSE

[The Apache 2.0 License](https://github.com/lukin0110/vorto/blob/master/LICENSE)
