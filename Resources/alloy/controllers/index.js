function Controller() {
    function inOpen(e) {
        chat.connect({
            joinResult: joinResult,
            nameResult: nameResult,
            message: newMessage,
            disconnect: disconnect,
            rooms: createRooms
        });
        setInterval(function() {
            chat.rooms();
        }, 3000);
        setTimeout(function() {
            $.message.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
            $.textFieldRooms.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
        }, 500);
    }
    function createRooms(e) {
        var data = [];
        for (var room in e) {
            room = room.substring(1, room.length);
            if (room) {
                var row = Alloy.createController("rowRoom", {
                    room: room
                }).getView();
                data.push(row);
            }
        }
        $.tableRooms.setData(data);
    }
    function disconnect(e) {}
    function newMessage(e) {
        $.conversation_table.appendRow(Alloy.createController("rowMessage", {
            message: e.text,
            me: !1
        }).getView());
        scrollToIndex();
        nMessages++;
    }
    function joinResult(e) {
        $.room.text = e.room;
        room = e.room;
    }
    function nameResult(e) {
        e.success && ($.user.text = e.name);
    }
    function sendMessage(e) {
        if ($.message.value) {
            $.conversation_table.appendRow(Alloy.createController("rowMessage", {
                message: $.message.value,
                me: !0
            }).getView());
            chatMessage();
            scrollToIndex();
            $.message.value = "";
            nMessages++;
        }
        closeKeyboard();
    }
    function chatMessage() {
        chat.message({
            room: room,
            text: $.message.value
        });
    }
    function scrollToIndex() {
        $.conversation_table.scrollToIndex(nMessages, {
            animated: !0
        });
    }
    function tableRoomsClick(e) {
        if (e.rowData.id === "rowRoom") {
            room = e.row.at;
            changeRoom();
            closeMenu();
        }
    }
    function changeRoom() {
        chat.room({
            room: room
        });
    }
    function closeKeyboard() {
        Ti.UI.Android.hideSoftKeyboard();
    }
    function optionsClick(e) {
        if (e.source.active) {
            closeMenu();
            e.source.active = !1;
        } else {
            openMenu();
            e.source.active = !0;
        }
    }
    function openMenu() {
        $.detail.animate({
            duration: 200,
            left: Ti.Platform.displayCaps.platformWidth - 45 + "px"
        });
    }
    function closeMenu() {
        $.detail.animate({
            duration: 200,
            left: "0px"
        });
    }
    function textRoom() {
        var newRoom = $.textFieldRooms.value.split(" ");
        room = newRoom[0];
        $.textFieldRooms.value = "";
        closeKeyboard();
        changeRoom();
        closeMenu();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    }), "Window", null);
    $.addTopLevelView($.__views.index);
    $.__views.master = A$(Ti.UI.createView({
        left: 0,
        top: 0,
        height: "100%",
        layout: "vertical",
        id: "master"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.master);
    $.__views.rooms = A$(Ti.UI.createLabel({
        width: "100%",
        height: "40px",
        text: "Rooms",
        font: {
            fontSize: "20px"
        },
        color: "black",
        textAlign: "left",
        backgroundColor: "green",
        id: "rooms"
    }), "Label", $.__views.master);
    $.__views.master.add($.__views.rooms);
    $.__views.textFieldRooms = A$(Ti.UI.createTextField({
        height: "40px",
        top: "5px",
        left: "5px",
        right: "5px",
        hintText: "Change rooms?",
        softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        id: "textFieldRooms"
    }), "TextField", $.__views.master);
    $.__views.master.add($.__views.textFieldRooms);
    $.__views.tableRooms = A$(Ti.UI.createTableView({
        top: 0,
        left: 0,
        width: "100%",
        bottom: 0,
        backgroundColor: "green",
        separatorColor: "transparent",
        minRowHeight: "40px",
        id: "tableRooms"
    }), "TableView", $.__views.master);
    $.__views.master.add($.__views.tableRooms);
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
        id: "header"
    }), "View", $.__views.detail);
    $.__views.detail.add($.__views.header);
    $.__views.options = A$(Ti.UI.createView({
        active: !1,
        height: "45px",
        width: "45px",
        left: 0,
        top: 0,
        backgroundColor: "blue",
        id: "options"
    }), "View", $.__views.header);
    $.__views.header.add($.__views.options);
    $.__views.containerUser = A$(Ti.UI.createView({
        backgroundColor: "red",
        left: "45px",
        right: 0,
        height: "100%",
        top: 0,
        id: "containerUser"
    }), "View", $.__views.header);
    $.__views.header.add($.__views.containerUser);
    $.__views.user = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "20px",
        text: "User",
        textAlign: "center",
        font: {
            fontSize: "14px"
        },
        color: "black",
        top: "0px",
        left: "10px",
        id: "user"
    }), "Label", $.__views.containerUser);
    $.__views.containerUser.add($.__views.user);
    $.__views.room = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: "20px",
        text: "Room",
        textAlign: "center",
        font: {
            fontSize: "14px"
        },
        color: "black",
        top: "20px",
        left: "10px",
        id: "room"
    }), "Label", $.__views.containerUser);
    $.__views.containerUser.add($.__views.room);
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
        minRowHeight: "30px",
        separatorColor: "transparent",
        id: "conversation_table"
    }), "TableView", $.__views.body);
    $.__views.body.add($.__views.conversation_table);
    $.__views.container_message = A$(Ti.UI.createView({
        width: "100%",
        height: "45px",
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
        color: "black",
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
    $.master.width = Ti.Platform.displayCaps.platformWidth - 45 + "px";
    $.options.on("click", optionsClick);
    $.send.on("singletap", sendMessage);
    $.textFieldRooms.on("return", textRoom);
    $.tableRooms.on("click", tableRoomsClick);
    $.index.on("open", inOpen);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;