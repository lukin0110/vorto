"use strict";
var fs = require("fs");
var path = require("path");
var q = require("q");
var spawn = require("child_process").spawn;

var DEFAULTS = {
    repo: "",
    full: false
};

/**
 * git --git-dir=.git log --pretty='%ct %h' -1
 * git --git-dir=.git log --pretty='%h' -1
 *
 * @param {object} options
 * @param {function} callback
 */
function git(options, callback) {
    var repo = (options && options.hasOwnProperty("repo")) ? options.repo : DEFAULTS.repo;
    var full = (options && options.hasOwnProperty("full")) ? options.full : DEFAULTS.full;
    var joined = path.join(repo, ".git");
    var format = full ? "%H" : "%h";

    if (!fs.existsSync(joined)) {
        throw new Error("No .git folder detected in the directory '" + repo + "'");
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
        var normalized = stdout.replace(/(?:\r\n|\r|\n)/g, "");
        //console.log("Version: " + normalized);
        callback(null, normalized);
    });
}

function gitp(options) {
    var deferred = q.defer();

    git(options, function(err, version) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(version);
        }
    });

    return deferred.promise;
}

module.exports = {
    git: git,
    gitp: gitp
};
