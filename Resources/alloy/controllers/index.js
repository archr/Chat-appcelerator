function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    }), "Window", null);
    $.addTopLevelView($.__views.index);
    $.__views.master = A$(Ti.UI.createView({
        backgroundColor: "red",
        left: 0,
        width: "270px",
        top: 0,
        height: "100%",
        id: "master"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.master);
    $.__views.rooms = A$(Ti.UI.createTableView({
        id: "rooms"
    }), "TableView", $.__views.master);
    $.__views.master.add($.__views.rooms);
    $.__views.detail = A$(Ti.UI.createView({
        backgroundColor: "blue",
        left: 0,
        width: "100%",
        top: 0,
        height: "100%",
        layout: "vertical",
        id: "detail"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.detail);
    $.__views.header = A$(Ti.UI.createView({
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "white",
        height: "45px",
        layout: "horizontal",
        id: "header"
    }), "View", $.__views.detail);
    $.__views.detail.add($.__views.header);
    $.__views.options = A$(Ti.UI.createView({
        active: !1,
        height: "45px",
        width: "45px",
        left: 0,
        backgroundColor: "blue",
        id: "options"
    }), "View", $.__views.header);
    $.__views.header.add($.__views.options);
    $.__views.room = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Room",
        textAlign: "center",
        font: {
            fontSize: "20px"
        },
        color: "black",
        backgroundColor: "green",
        id: "room"
    }), "Label", $.__views.header);
    $.__views.header.add($.__views.room);
    $.__views.body = A$(Ti.UI.createView({
        width: "100%",
        height: "100%",
        left: 0,
        backgroundColor: "#ccc",
        id: "body"
    }), "View", $.__views.detail);
    $.__views.detail.add($.__views.body);
    $.__views.conversation_table = A$(Ti.UI.createTableView({
        top: 0,
        bottom: "45px",
        width: "100%",
        backgroundColor: "red",
        minRowHeight: "30px",
        id: "conversation_table"
    }), "TableView", $.__views.body);
    $.__views.body.add($.__views.conversation_table);
    $.__views.container_message = A$(Ti.UI.createView({
        width: "100%",
        height: "45px",
        backgroundColor: "green",
        bottom: 0,
        id: "container_message"
    }), "View", $.__views.body);
    $.__views.body.add($.__views.container_message);
    $.__views.message = A$(Ti.UI.createTextArea({
        left: "5px",
        right: "50px",
        top: "2px",
        bottom: "2px",
        softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS,
        id: "message"
    }), "TextArea", $.__views.container_message);
    $.__views.container_message.add($.__views.message);
    $.__views.send = A$(Ti.UI.createButton({
        width: "45px",
        height: "45px",
        right: 0,
        title: "Send",
        id: "send"
    }), "Button", $.__views.container_message);
    $.__views.container_message.add($.__views.send);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var chat = require("chat"), nMessages = 0, room = "Lobby";
    $.options.on("click", function(e) {
        if (e.source.active) {
            $.detail.animate({
                duration: 200,
                left: "0px"
            });
            e.source.active = !1;
        } else {
            $.detail.animate({
                duration: 200,
                left: Ti.Platform.displayCaps.platformWidth - 45 + "px"
            });
            e.source.active = !0;
        }
    });
    $.index.on("open", function() {
        chat.connect({
            joinResult: function(e) {
                $.room.text = "Room: " + e.room;
                room = e.room;
            },
            nameResult: function(e) {
                alert(e);
            },
            message: function(e) {
                $.conversation_table.appendRow(Alloy.createController("rowMessage", {
                    message: e.text,
                    me: !1
                }).getView());
                $.conversation_table.scrollToIndex(nMessages, {
                    animated: !0
                });
                nMessages++;
            },
            disconnect: function(e) {}
        });
        setTimeout(function() {
            $.message.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
        }, 500);
    });
    $.send.on("singletap", function(e) {
        if ($.message.value) {
            chat.message({
                room: room,
                text: $.message.value
            });
            $.conversation_table.appendRow(Alloy.createController("rowMessage", {
                message: $.message.value,
                me: !0
            }).getView());
            $.conversation_table.scrollToIndex(nMessages, {
                animated: !0
            });
            $.message.value = "";
            nMessages++;
        }
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;