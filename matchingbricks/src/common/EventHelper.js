/*
* EventHelper;
*/
var EventHelper = (function(_super) {
    function EventHelper() {
        EventHelper.super(this);
    }
    Laya.class(EventHelper, "EventHelper", _super);
    EventHelper.instance = new EventHelper();
    return EventHelper;
}(Laya.EventDispatcher));