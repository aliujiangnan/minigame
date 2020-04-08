/*
* ReadyBar;
*/
var ReadyBar = (function (_super) {
    function ReadyBar(type) {
        ReadyBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.initSelf();
    }

    Laya.class(ReadyBar,"ReadyBar",_super);

    var __proto = ReadyBar.prototype;
    __proto.initSelf = function(){
        var sp = new Laya.Sprite();
        sp.graphics.drawRect(0,0,this.width,this.height, "#000000");
        sp.alpha = 0.2;
        this.addChild(sp);

        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_ready.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        bg.scale(0.5, 0.5 * Global.scaleY);
        bg.zOrder = 10;
        bg.alpha = 0.6;
        this.addChild(bg);

        Laya.Tween.to(bg, {alpha: 0.6, scaleX: 1, scaleY: 1 * Global.scaleY}, 200);
        Laya.timer.once(800,this,function(){
            Laya.Tween.to(bg, {alpha: 0, scaleX: 1, scaleY: 1 * Global.scaleY}, 800);
        });

        var ready = new Laya.Sprite();
        ready.loadImage("texture/game/ready.png");
        ready.pivot(ready.width / 2, ready.height / 2);
        ready.pos(this.width / 2, this.height / 2);
        ready.scale(2, 2 * Global.scaleY);
        ready.alpha = 1;
        ready.visible = false;
        ready.zOrder = 11;
        this.addChild(ready);

        Laya.timer.once(200,this,function(){
            ready.visible = true;
            Laya.Tween.to(ready, {alpha: 1, scaleX: 1, scaleY: 1 * Global.scaleY}, 200);
            Laya.timer.once(200, this, function(){
                Laya.Tween.to(ready, {alpha: 0, scaleX: 1, scaleY: 1 * Global.scaleY}, 800);
            });
        });

        Laya.timer.once(1000,this,function(){
            ready.removeSelf();
            ready.destroy();

            var go = new Laya.Sprite();
            go.graphics.clear();
            go.loadImage("texture/game/go.png");
            go.pivot(go.width / 2, go.height / 2);
            go.pos(this.width / 2, this.height / 2);
            go.scale(2, 2 * Global.scaleY);
            go.alpha = 1;
            go.zOrder = 12;
            this.addChild(go);
            Laya.Tween.to(go, {alpha: 1, scaleX: 1, scaleY: 1 * Global.scaleY}, 200);
            Laya.timer.once(200, this, function(){
                Laya.Tween.to(go, {alpha: 0, scaleX: 1, scaleY: 1 * Global.scaleY}, 400);
            })
        });

        Laya.timer.once(2000,this,function(){
            this.removeSelf();
            this.destroy();
        });
    };

    return ReadyBar;
}(Laya.View));