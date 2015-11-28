"use strict";
var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;

var DEFAULTS = {
    repo: ""
};

/**
 * %h/%H %t %T
 */
function vorto() {
    var length = arguments.length;
    var format, options, callback;

    if (typeof arguments[length-1] !== "function") {
        throw new Error("The last argument must be a callback function: function(err, version){...}");
    } else {
        callback = arguments[length-1];
    }

    if (length === 1) {
        format = "%h";
        options = DEFAULTS;

    } else if (length === 2) {
        if (typeof arguments[0] !== "string") {
            callback(new Error("First argument must be a string"), null);
        }
        format = arguments[0];
        options = DEFAULTS;

    } else if (length === 3) {
        if (typeof arguments[0] !== "string") {
            callback(new Error("First argument must be a string"), null);
        }

        if (typeof arguments[1] !== "object") {
            callback(new Error("Second argument must be an object"), null);
        }

        format = arguments[0];
        options = arguments[1];
    }

    git(format, options, callback);
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
    var repo = (options && options.hasOwnProperty("repo")) ? options.repo : DEFAULTS.repo;
    var joined = path.join(repo, ".git");

    if (!fs.existsSync(joined)) {
        callback(new Error("No .git folder detected in the directory '" + repo + "'"), null);
        return;
    }

    var child = spawn("git", ["--git-dir=" + joined, "log", "--pretty=" + format, "-1"], {cwd: process.cwd()}),
        stdout = "",
        stderr = "";

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
        stdout += data;
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
        stderr += data;
    });

    child.on("close", function() {
        if (stderr.length > 0) {
            callback(new Error("An error occurred: '" + stderr + "'"), null);
        } else {
            var normalized = stdout.replace(/(?:\r\n|\r|\n)/g, "");
            callback(null, normalized);
        }
    });
}

module.exports = vorto;
