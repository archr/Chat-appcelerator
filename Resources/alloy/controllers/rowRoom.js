function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.rowRoom = A$(Ti.UI.createTableViewRow({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "rowRoom"
    }), "TableViewRow", null);
    $.addTopLevelView($.__views.rowRoom);
    $.__views.room = A$(Ti.UI.createLabel({
        color: "black",
        font: {
            fontSize: "16px"
        },
        left: "10px",
        right: "5px",
        top: "3px",
        height: Ti.UI.SIZE,
        id: "room"
    }), "Label", $.__views.rowRoom);
    $.__views.rowRoom.add($.__views.room);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.room.text = args.room || "";
    $.rowRoom.at = args.room || "";
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;