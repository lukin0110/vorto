var vorto = require("./vorto.js");


vorto(function(err, version) {
    console.log("Version 1: " + version);
});

vorto("%H", function(err, version) {
    console.log("Version 2: " + version);
});

vorto("%ct-%h", {repo: "../triflux"}, function(err, version) {
    console.log("Version 3.1: " + err);
    console.log("Version 3.2: " + version);
});
