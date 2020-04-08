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

    Utils.getS2TAngle = function (targetPos, selfPos, direction) {
        var angle = 360 * (Math.atan((targetPos.y - selfPos.y) / (targetPos.x - selfPos.x))) / (2 * Math.PI);
        var S2TAngle = 0;

        if (targetPos.x > selfPos.x && targetPos.y > selfPos.y)
            S2TAngle = angle;
        else if (targetPos.x < selfPos.x && !(targetPos.y == selfPos.y))
            S2TAngle = 180 + angle;
        else if (targetPos.x > selfPos.x && targetPos.y < selfPos.y)
            S2TAngle = 360 + angle;
        else if (targetPos.x > selfPos.x && targetPos.y == selfPos.y)
            S2TAngle = 0;
        else if (targetPos.x == selfPos.x && targetPos.y > selfPos.y)
            S2TAngle = 90;
        else if (targetPos.x < selfPos.x && targetPos.y == selfPos.y)
            S2TAngle = 180;
        else if (targetPos.x == selfPos.x && targetPos.y < selfPos.y)
            S2TAngle = 270;
        else if (targetPos.x == selfPos.x && targetPos.y == selfPos.y)
            S2TAngle = 0;

        if (direction > 0)
            return 360 - S2TAngle;

        return -S2TAngle;
    }

    return Utils;
}());