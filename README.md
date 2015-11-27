# Vorto.js

Simple module to generate a version code based on the latest git commit hash. This can be used with 
[Gulp](http://gulpjs.com), or any other build system, when you're creating build artifacts.

## Install
```
$ npm install vorto --save
```

## Usage
```js
var vorto = require("vorto");

vorto.git({full: true}, function(err, version) {
    console.log("Version: " + version);
});
```

## Options

* `repo`: specify the directory of the repository that you want to generate a version code for. The *default* is 
the current directory
* `full`: do you want to fetch the full commit hash or the abbreviated. The *default* is the abbreviated hash.

## LICENSE

[The Apache 2.0 License](https://github.com/lukin0110/vorto/blob/master/LICENSE)
