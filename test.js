'use strict';
var vorto = require('./vorto.js');
var should = require('should');     // https://github.com/tj/should.js/
require('mocha');

describe('vorto', function() {
    it('should return code of length 7', function(done) {
        vorto(function(err, version) {
            //noinspection BadExpressionStatementJS
            (err === null).should.be.true;
            version.should.be.type('string');
            version.should.have.length(7);
            console.log("Version 1: " + version);
            done();
        });
    });

    it('should return code of length 40', function(done) {
        vorto("%H", function(err, version) {
            console.log("Version 2: " + version);
            version.should.have.length(40);
            done();
        });
    });

    it('should return an error', function(done) {
        vorto({repo: "../doesntExist"}, function(err) {
            should.exist(err);
            var errStr = err.toString();
            errStr.should.be.exactly("Error: No .git folder detected in the directory '../doesntExist'");
            done();
        });
    });

    it("should return timestamp and short code", function(done) {
        vorto("%ct-%h", function(err, version) {
            console.log("Version 3: " + version);
            version.should.be.length(18);
            //noinspection BadExpressionStatementJS
            (version.indexOf("-") === 10).should.be.true;
            done();
        });
    });

    it("should return the package version", function(done) {
        vorto("%j", function(err, version) {
            console.log("Version 4: " + version);
            var pack = require("./package.json");
            version.should.be.exactly(pack.version);
            done();
        });
    });

    it("should just return the current repo", function(done) {
        vorto({repo: "./"}, function(err, version) {
            version.should.be.length(7);
            done();
        });
    });
});
