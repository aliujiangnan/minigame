/*
* Player;
*/
var Player = (function (_super) {
    function Player(type) {
        Player.super(this);
        this._type = type;
        this.initSelf();
    }
    Laya.class(Player,"Player",_super);
    Player.prototype.initSelf = function(){                
        var sp = new Laya.Sprite();
        sp.loadImage("texture/game/player_"+this._type+".png");
        sp.zOrder = 100;
        this.size(sp.width,sp.height);
        this.pivot(this.width / 2,this.height / 2);
        this.sp = sp;
        this.addChild(sp);
        this.scaleY = Global.scaleY;
        this.invincible = false;
    };
    Player.prototype.setInvincible = function(invincible){
        this.invincible = invincible;
        this.sp.visible = true;

        Laya.timer.loop(200,this.sp,function(){
            this.sp.visible = !this.sp.visible;
        }.bind(this))

        Laya.timer.once(3000,this.sp,function(){
            Laya.timer.clearAll(this.sp);
            this.sp.visible = true;
            this.invincible = false;
        }.bind(this))
    }
    return Player;
}(Laya.Sprite));