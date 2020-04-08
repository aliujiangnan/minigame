/*
* Skill;
*/
var Skill = (function (_super) {
    function Skill(type, callback) {
        Skill.super(this);
        this.type = type;
        this.isReady = false;
        this.callback = callback;
        this.initSelf();
    }

    Laya.class(Skill,"Skill",_super);

    var resArr = ["texture/game/skill_0_0.png","texture/game/skill_0_1.png","texture/game/skill_1_0.png","texture/game/skill_1_1.png"];

    var __proto = Skill.prototype;
    __proto.initSelf = function(){
        this.loadImage(resArr[this.type]);
        this.pivot(this.width / 2,this.height / 2);

        var sp = new Laya.Sprite();
        sp.graphics.drawCircle(this.width / 2,this.height / 2,this.width / 2,"#000000");
        sp.alpha = 0.5;
        this.addChild(sp);
        this.selfMask = sp;
        var timeArr = [8, 15];
        this.cd = timeArr[this.type % 2];

        this.timeBar = new TimeBar(this.cd, false, this.onTimeOver.bind(this));
        this.timeBar.pos(this.width/2,this.height/2);
        this.addChild(this.timeBar);
        this.timeBar.zOrder = 100;

        var loop = new Laya.Sprite()
        loop.loadImage("texture/game/loop_0.png");
        loop.pivot(loop.width / 2,loop.height / 2);
        loop.pos(this.width/2,this.height/2);
        this.addChild(loop);
        loop.visible = false;
        this.loop = loop;

        var loop1 = new Laya.Sprite()
        loop1.loadImage("texture/game/loop_1.png");
        loop1.pivot(loop1.width / 2,loop1.height / 2);
        loop1.pos(this.width/2,this.height/2);
        this.addChild(loop1);
        loop1.visible = false;
        this.loop1 = loop1;
    };
    __proto.startCd = function(time){
        this.timeBar.startTimeDown(time);
        Laya.timer.clearAll(this);
        this.selfMask.visible = true;
        this.isReady = false;
        this.loop.visible = false;
        this.loop1.visible = false;
        this.timeBar.visible = true;
    };
    __proto.onTimeOver = function(){
        this.selfMask.visible = false;
        this.isReady = true;
        this.loop.visible = true;
        this.loop1.visible = true;
        this.timeBar.visible = false;
        var func = function (){
            Laya.Tween.to(this.loop1,{rotation:this.loop1.rotation + 360}, 5000);
        }.bind(this);
        func();
        Laya.timer.loop(5000,this,func);
        if(Global.robotType == 1 && this.type > 1){
            this.callback(this.type - 2);
        }
            
    };
    __proto.stopCd = function(){
        Laya.timer.clearAll(this.timeBar);
        Laya.Tween.clearAll(this.loop1);
        Laya.timer.clearAll(this);
    };
    return Skill;
}(Laya.Sprite));