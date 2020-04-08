"use strict";
cc._RF.push(module, '63a7dmbHu5M3rhwIeedLmt0', 'Utils');
// script/utils/Utils.js

"use strict";

var utils = {};

utils.getRad = function (deg) {
    return deg / 360 * Math.PI * 2;
};

utils.getDeg = function (rad) {
    return rad / (2 * Math.PI) * 360;
};

utils.getS2TAngle = function (x, x1, y, y1, direction) {
    var angle = 360 * Math.atan((y - y1) / (x - x1)) / (2 * Math.PI);
    var S2TAngle = 0;

    if (x > x1 && y > y1) S2TAngle = angle;else if (x < x1 && !(y == y1)) S2TAngle = 180 + angle;else if (x > x1 && y < y1) S2TAngle = 360 + angle;else if (x > x1 && y == y1) S2TAngle = 0;else if (x == x1 && y > y1) S2TAngle = 90;else if (x < x1 && y == y1) S2TAngle = 180;else if (x == x1 && y < y1) S2TAngle = 270;else if (x == x1 && y == y1) S2TAngle = 0;

    if (direction > 0) return 360 - S2TAngle;

    return -S2TAngle;
};

utils.getDistance = function (x, x1, y, y1) {
    return Math.pow((x - x1) * (x - x1) + (y - y1) * (y - y1), .5);
};
module.exports = utils;

cc._RF.pop();