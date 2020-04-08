/*
* Player;
*/
var Player = (function (_super) {
    function Player(type) {
        Player.super(this);
        this.size(184, 209);
        this.pivot(this.width / 2, this.height / 2);
        this.type = type;
        this.anim = new Laya.Animation();
        this.addChild(this.anim);
        this.playAnim("idle");
        this.delta = new Laya.Sprite();
    }

    Laya.class(Player,"Player",_super);

    var __proto = Player.prototype;
    __proto.playDizzy = function(posY,setting){
        this.isDizzy = true;
        this.y = posY - 80;
        Laya.Tween.to(this,{y:this.y + 80}, 400, null, Laya.Handler.create(this, function(){
            this.isDizzy = false;
        }.bind(this)));
        this.playAnim("dizzy", 400);
    };

    __proto.displayUseful = function(x){        
        this.delta.loadImage("texture/game/delta_2.png");
        this.delta.pivot(this.delta.width/2, this.delta.height/2);
        this.delta.pos(this.width * 0.6, -70);
        this.delta.scale(1.6 * x, 1.6);
        this.addChild(this.delta);

        Laya.timer.once(10000, this, function(){
            this.delta.removeSelf();
        });
    };


    __proto.playAnim = function(name,time){
        switch(name){
            case "idle":
            {
                var n = name +"_" + this.type;
                this.anim.play(0,true, n);
                this.anim.interval = 400;
            }
            break;
            
            case "jump":
            {
                this.anim.play(0,true,name + "_" + this.type);
                this.anim.interval = 50;
                Laya.timer.once(time,this,function(){
                    this.playAnim("idle");
                });
            }
            break;

            case "dizzy":
            {
                this.anim.play(0,true,name + "_" + this.type);
                this.anim.interval = 100;
                var anim = new Laya.Animation();
                anim.interval = 50;
                anim.play(0,true,"star");
                anim.pivotX = 86 / 2;
                anim.pivotY = 41 / 2;
                anim.x = this.width / 2 + 20;
                anim.y = 0;
                anim.scaleX = 1.2;
                anim.scaleY = 1.2;
                this.addChild(anim)
                Laya.timer.once(time,this,function(){
                    this.playAnim("idle");
                    anim.removeSelf();
                });
            }
            break;
        }
    };
    return Player;
}(Laya.Sprite));