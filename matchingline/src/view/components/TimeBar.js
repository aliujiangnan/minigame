/*
* TimeBar;
*/
var TimeBar = (function (_super) {
    function TimeBar() {
        TimeBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.1);
        this.scale(Global.scaleY, Global.scaleX);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.offset = 0;
        this.initSelf();
    }

    Laya.class(TimeBar,"TimeBar",_super);

    var __proto = TimeBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_timer.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var txt = new Laya.Text();
        txt.text = "20";
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

        var delta = new Laya.Sprite();
        delta.loadImage("texture/game/delta_0.png");
        delta.pivot(delta.width / 2, delta.height / 2);
        delta.pos(this.width / 2 - 43, this.height / 2);
        delta.visible = false;
        this.addChild(delta);
        this.leftDelta = delta;

        var delta1 = new Laya.Sprite();
        delta1.loadImage("texture/game/delta_0.png");
        delta1.pivot(delta1.width / 2, delta1.height / 2);
        delta1.pos(this.width / 2 + 43, this.height / 2);
        delta1.visible = false;
        this.addChild(delta1);
        this.rightDelta = delta1;

        this.isRed = false;
    };

    __proto.startTimeDown = function (type) {            
        if(type == 0){
            this.leftDelta.visible = true;
            this.rightDelta.visible = false;
        }
        else if(type == 1){
            this.leftDelta.visible = false;
            this.rightDelta.visible = true;
        }
        
        this.startTime = Date.now();
        this.onTimer(type);
        Laya.timer.loop(200, this, this.onTimer, [type]);
    };

    __proto.onTimer = function (type) {
        var current = Date.now() - this.offset;
        var offset = parseInt((current - this.startTime) / 1000);
        var timeDown = 20 - offset;
        if(timeDown < 0)
            timeDown = 0;
        
        this.timeTxt.text = "" + timeDown;
        if (parseInt(this.timeTxt.text) < 10){
            if(!this.isRed){
                this.isRed = true;
                this.onTimerRed(type);
                Laya.timer.loop(1000, this, this.onTimerRed, [type]);
            }
        }
        if(this.timeTxt.text == "0"){
            this.parent.gameOver(this.type == 0 ? 0 : 1);
            this.stopTimeDown(false);
            return;
        }
    };

    __proto.onTimerRed = function (type) {
        if (parseInt(this.timeTxt.text) < 10){
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
            if(type == 0){
                this.leftDelta.graphics.clear();
                this.leftDelta.loadImage("texture/game/delta_0_red.png");
            }
            else if(type == 1){
                this.rightDelta.graphics.clear();
                this.rightDelta.loadImage("texture/game/delta_1_red.png");
            }
        }
    };

    __proto.stopTimeDown = function (isReset) {
        if (isReset) {
            this.timeTxt.text = "";
            this.leftDelta.visible = false;
            this.rightDelta.visible = false;
            this.leftDelta.graphics.clear();
            this.leftDelta.loadImage("texture/game/delta_0.png");
            this.rightDelta.graphics.clear();
            this.rightDelta.loadImage("texture/game/delta_1.png");
        }
        this.timeTxt.color = "#ffffff";
        this.timeTxt.strokeColor = "#ffffff";
        this.isRed = false;
        Laya.timer.clearAll(this)
    };

    return TimeBar;
}(Laya.View));