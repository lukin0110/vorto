var vorto = require("./vorto.js");

vorto.git({}, function(err, version) {
    console.log("Version: " + version);
});

vorto.git({full: true}, function(err, version) {
    console.log("Version: " + version);
});
