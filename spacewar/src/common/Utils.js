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

    Utils.getP2PDistance = function (selfPos, targetPos) {
        return Math.sqrt(Math.pow(targetPos.x - selfPos.x, 2) + Math.pow(targetPos.y - selfPos.y, 2));
    }

    Utils.getP2LDistance = function (pointPos, lineHeadPos, lineAngle, direction) {
        var angle = Utils.getS2TAngle(pointPos, lineHeadPos, direction) - lineAngle - 180;

        return Utils.getP2PDistance(lineHeadPos, pointPos) * Math.sin(2 * Math.PI * (Math.abs(angle) / 360));
    }

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

    Utils.isHit = function (x, y, r, x1, y1) {
        return (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y) < r * r
    };


    Utils.isOut = function (x, y, r, w, h) {
        return x >= w + r || x <= -r || y >= h + r || y <= -r;
    }

    return Utils;
}());