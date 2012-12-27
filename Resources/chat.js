var io = require("socket.io"), socket;

exports.connect = function(o) {
    if (socket) {
        alert("disconnect");
        exports.disconnect();
    }
    socket = io.connect("http://sandtonio.chat.jit.su:80");
    socket.on("connect", function() {});
    socket.on("joinResult", function(e) {
        o.joinResult && o.joinResult(e);
    });
    socket.on("nameResult", function(e) {
        o.nameResult && o.nameResult(e);
    });
    socket.on("message", function(e) {
        o.message && o.message(e);
    });
    socket.on("disconnect", function() {
        o.disconnect && o.disconnect();
        exports.disconnect();
    });
    socket.on("connect_failed", function(e) {});
    socket.on("error", function(e) {});
};

exports.message = function(e) {
    socket && socket.emit("message", {
        room: e.room,
        text: e.text
    });
};

exports.disconnect = function() {
    socket && socket.disconnect();
};