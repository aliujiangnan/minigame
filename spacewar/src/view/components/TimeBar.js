/*
* TimeBar;
*/
var TimeBar = (function (_super) {
    function TimeBar(time, playRed, callback) {
        TimeBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.1);
        this.scale(Global.scaleY, Global.scaleX);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.offset = 0;
        this.max = time;
        this.playRed = playRed;
        this.callback = callback;
        this.initSelf();
    }

    Laya.class(TimeBar, "TimeBar", _super);

    var __proto = TimeBar.prototype;
    __proto.initSelf = function () {

        var txt = new Laya.Text();
        txt.text = "" + this.max;
        txt.fontSize = 50;
        txt.color = "#ffffff";
        txt.stroke = 1;
        txt.strokeColor = "#ffffff";
        txt.align = "center";
        txt.size(100, 50);
        txt.pivot(50, 25);
        txt.pos(this.width / 2, this.height / 2 + 4.5);
        this.addChild(txt);
        this.timeTxt = txt;

        this.isRed = false;
    };

    __proto.startTimeDown = function (type) {
        this.startTime = Date.now();
        this.onTimer(type);
        Laya.timer.loop(200, this, this.onTimer, [type]);
    };

    __proto.onTimer = function (type) {
        var current = Date.now() - this.offset;
        var offset = parseInt((current - this.startTime) / 1000);
        var timeDown = this.max - offset;
        if (timeDown < 0)
            timeDown = 0;

        this.timeTxt.text = "" + timeDown;
        if (this.playRed && parseInt(this.timeTxt.text) < 10) {
            if (!this.isRed) {
                this.isRed = true;
                this.onTimerRed(type);
                Laya.timer.loop(1000, this, this.onTimerRed, [type]);
            }
        }
        if (this.timeTxt.text == "0") {
            if(this.callback != undefined) this.callback();
            return;
        }
    };

    __proto.onTimerRed = function (type) {
        if (parseInt(this.timeTxt.text) < 10) {
            this.timeTxt.color = "#ff0000";
            this.timeTxt.strokeColor = "#ff0000";
            var txt = new Laya.Text();
            txt.text = this.timeTxt.text;
            txt.fontSize = 50;
            txt.color = "#ff0000";
            txt.stroke = 1;
            txt.strokeColor = "#ff0000";
            txt.align = "center";
            txt.size(this.timeTxt.width, this.timeTxt.height);
            txt.pivot(this.timeTxt.pivotX, this.timeTxt.pivotY);
            txt.pos(this.timeTxt.x, this.timeTxt.y);
            txt.zOrder = 10;
            this.timeTxt.parent.addChild(txt);
            Laya.Tween.to(txt, { scaleX: 2, scaleY: 2, alpha: 0 }, 500);
            Laya.timer.once(500, this, function () {
                this.timeTxt.parent.removeChild(txt);
            });
        }
    };

    __proto.stopTimeDown = function (isReset) {
        if (isReset) {
            this.timeTxt.text = "";
        }
        this.isRed = false;
        Laya.timer.clearAll(this)
    };

    return TimeBar;
}(Laya.View));