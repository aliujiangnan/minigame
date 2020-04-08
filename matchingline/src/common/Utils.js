/*
* Utils;
*/
var Utils = (function () {
    function Utils() {
    }
    Utils.seededRandom = function (max, min) {
        max = max || 1;
        min = min || 0;
        Global.seed = (Global.seed * 9301 + 49297) % 233280;
        var rnd = Global.seed / 233280.0;
        return min + rnd * (max - min);
    };
    return Utils;
}());