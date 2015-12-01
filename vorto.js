'use strict';
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var DEFAULTS = {
    repo: '',       // path to the repository, default the current one
    git: 'git'      // path to the git command, default it's assumed to be in the $PATH environment variable
};

/**
 * %h/%H %t %T
 */
function vorto() {
    var length = arguments.length;
    var format, options, callback;

    if (typeof arguments[length-1] !== 'function') {
        throw new Error('The last argument must be a callback function: function(err, version){...}');
    } else {
        callback = arguments[length-1];
    }

    if (length === 1) {
        format = '%h';
        options = DEFAULTS;

    } else if (length === 2) {
        if (typeof arguments[0] === 'string') {
            format = arguments[0];
            options = DEFAULTS;
        } else if (typeof arguments[0] === 'object'){
            format = '%h';
            options = createOptions(arguments[0], DEFAULTS);
        } else {
            throw new Error('First argument must be a \'string\' or an \'object\'');
        }

    } else if (length === 3) {
        if (typeof arguments[0] !== 'string') {
            throw new Error('First argument must be a string');
        }

        if (typeof arguments[1] !== 'object') {
            throw new Error('Second argument must be an object');
        }

        format = arguments[0];
        options = createOptions(arguments[1], DEFAULTS);
    }

    if (format.indexOf('%j')>-1) {
        var j = packageVersion(options.repo);

        git(format, options, function(err, version) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, version.replace('%j', j));
            }
        });

    } else {
        git(format, options, callback);
    }
}

/**
 *
 * @param {object} options
 * @param {object} defaults
 * @returns {{repo: (string|*|string), git: (string|*)}}
 */
function createOptions(options, defaults) {
    return {
        repo: options.repo ? options.repo : defaults.repo,
        git: options.git ? options.git : defaults.git
    };
}

/**
 * Load the version from package.json
 *
 * @param {string} repo
 */
function packageVersion(repo) {
    var location = repo ? path.join(repo, 'package.json') : './package.json';
    var pack = require(location);
    return pack['version'];
}

/**
 * git --git-dir=.git log --pretty='%ct %h' -1
 * git --git-dir=.git log --pretty='%h' -1
 *
 * More info about the formatting options: http://git-scm.com/docs/pretty-formats
 *
 * @param {string} format
 * @param {object} options
 * @param {function} callback
 */
function git(format, options, callback) {
    var joined = path.join(options.repo, '.git');

    if (!fs.existsSync(joined)) {
        callback(new Error('No .git folder detected in the directory \'' + options.repo + '\''), null);
        return;
    }

    var stdout = '';
    var stderr = '';
    var child = spawn(options.git, ['--git-dir=' + joined, 'log', '--pretty=' + format, '-1'], {cwd: process.cwd()});

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        stdout += data;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        stderr += data;
    });

    child.on('close', function() {
        if (stderr.length > 0) {
            callback(new Error('An error occurred: \'' + stderr + '\''), null);
        } else {
            var normalized = stdout.replace(/(?:\r\n|\r|\n)/g, '');
            callback(null, normalized);
        }
    });
}

module.exports = vorto;
