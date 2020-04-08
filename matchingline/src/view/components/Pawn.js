/*
* Pawn;
*/
var Pawn = (function (_super) {
    function Pawn(color, x, y) {
        Pawn.super(this);
        this.loadImage("texture/game/pawn_" + color + ".png");
        this.pivot(this.width / 2, this.height / 2);
        this.color = color;
        return this;
    }

    Laya.class(Pawn,"Pawn",_super);

    var __proto = Pawn.prototype;
    __proto.setColor = function (color) {
        if(color != this.color){
            this.color = color;            
            
            var func = function(){
                this.graphics.clear();
                this.loadImage("texture/game/pawn_" + color + ".png");
                Laya.Tween.to(this,{scaleX:1.2,scaleY:1.2,x:this.x - 1, y:this.y - 20},225,Laya.Ease.quintOut,Laya.Handler.create(this,func1));
            }.bind(this);
            
            var func1 = function(){
                this.zOrder = 100;
                Laya.Tween.to(this,{scaleX:1.1, scaleY:1.1,x:this.x + 1, y:this.y + 20},100,null,Laya.Handler.create(this,func2));
            }.bind(this);

            var func2 = function(){
                Laya.Tween.to(this,{scaleX:1,scaleY:1,x:this.x + 1, y:this.y + 20},100,null,Laya.Handler.create(this,func3));
            }.bind(this);

            var func3 = function(){
                Laya.Tween.to(this,{scaleX:1.2,scaleY:1.2},100,null,Laya.Handler.create(this,func4));
            }.bind(this);

            var func4 = function(){
                var green = new Laya.Sprite();
                green.loadImage("texture/game/green.png");
                green.pivot(green.width/2,green.height/2);
                green.pos(this.x - 0.6,this.y - 1.5);
                this.parent.addChild(green);
                Laya.Tween.to(green,{alpha:0},500,null,Laya.Handler.create(this,func5,[green]));
                Laya.Tween.to(this,{scaleX:1,scaleY:1},200);
            }.bind(this)

            var func5 = function(green){
                green.removeSelf();
            }.bind(this)

            this.zOrder = 200;
            Laya.Tween.to(this,{scaleX:0.1,scaleY:1.1,x:this.x - 1, y:this.y - 20},225,Laya.Ease.quintIn,Laya.Handler.create(this,func));
            Laya.timer.once(200, this, function(){
                if(Global.isMusicOn) Laya.SoundManager.playSound("sound/flip.mp3");
            });
        }
    };
    return Pawn;
}(Laya.Sprite));
