function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.rowMessage = A$(Ti.UI.createTableViewRow({
        backgroundColor: "blue",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "rowMessage"
    }), "TableViewRow", null);
    $.addTopLevelView($.__views.rowMessage);
    $.__views.message = A$(Ti.UI.createLabel({
        color: "black",
        font: {
            fontSize: "16px"
        },
        left: "5px",
        right: "5px",
        top: "3px",
        height: Ti.UI.SIZE,
        id: "message"
    }), "Label", $.__views.rowMessage);
    $.__views.rowMessage.add($.__views.message);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.message.text = args.message || "";
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;