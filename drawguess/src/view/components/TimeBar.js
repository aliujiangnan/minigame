/*
* TimeBar;
*/
var TimeBar = (function (_super) {
    function TimeBar(time) {
        TimeBar.super(this);
        this.scale(Global.scaleY,  Global.scaleX);
        this.size(100,  100);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.offset = 0;
        this.max = time;
        this.initSelf();
    }
    Laya.class(TimeBar,"TimeBar",_super);

    var __proto = TimeBar.prototype;
    __proto.initSelf = function () {
        var clock = new Laya.Sprite();
        clock.loadImage("res/ready/clock.png");
        clock.pivot(clock.width / 2, clock.height / 2);
        clock.pos(this.width/2 + 2, this.height/2 + 2);
        this.addChild(clock);

        var txt = new Laya.Text();
        txt.text = "--";
        txt.fontSize = 50;
        txt.color = "#ff0000";
        txt.font = "fnt_time";
        txt.width = 100;
        txt.pivotX = 50;
        txt.align = "center";
        txt.pos(52, 35);
        this.addChild(txt);
        this.timeTxt = txt;
    };
    __proto.startTimeDown = function (time) {
        this.reset();
        var date = new Date();
        if(time == 0) {
            time = date.getTime();
            this.offset = 0;
        }
        else
            this.offset = Global.timeOffset;
        
        this.startTime = this.offset == 0 ? Date.now():time;
        this.onTimer();
        Laya.timer.loop(200, this, this.onTimer);
        
    };
    __proto.onTimer = function () {
        var date = new Date();
        var currentTime = date.getTime() + this.offset;
        
        var offset = parseInt("" + (currentTime - this.startTime ) / 1000);
        var timeDown = this.max - offset;
        
        if(timeDown < 0)
            timeDown = 0;
        
        this.timeTxt.text = "" + timeDown;
    };
    __proto.reset = function(){
        this.timeTxt.text = "" + this.max;
        this.offset = 0;
        this.startTime = 0;
        Laya.timer.clearAll(this);
    }
    return TimeBar;
}(Laya.View));