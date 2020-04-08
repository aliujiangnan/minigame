/*
* Candy
*/
var Candy = (function (_super) {
    function Candy(type,) {
        Candy.super(this);
        this.type = type;
        this.isRolling = false;
        this.rollingTime = 0;
        this.initSelf();
    }
    Laya.class(Candy,"Candy",_super);
    Candy.prototype.initSelf = function(){        
        var sp = new Laya.Sprite();
        sp.loadImage("texture/game/candy_" + Global.srcType + "/candy_0.png");
        sp.pivot(sp.width / 2, sp.height / 2);
        sp.pos(sp.width / 2, sp.height / 2);
        this.addChild(sp);
        this.sp = sp;

        this.size(sp.width, sp.height);
        this.pivot(sp.width / 2, sp.height / 2);
    };
    Candy.prototype.appear = function(){
        this.scale(0,0);
        var t = parseInt("" + Math.random() * 1000);

        var func1 = function(){
            Laya.Tween.to(this, {scaleX:1,scaleY:1},200);
        };

        var func = function(){
            Laya.Tween.to(this,{scaleX:1.1,scaleY:1.1}, 300, null, Laya.Handler.create(this,func1));
        };
        Laya.timer.once(t,this,func);
        
    };
    Candy.prototype.setBack = function () {
        this.rollingTime = 350;
        var func1 = function(){
            this.rollingTime -= 10;
        }
        Laya.timer.loop(20,this,func1);
        Laya.timer.once(340,this,function(){
            Laya.timer.clear(this,func1);
        });
        var func = function(){
            this.sp.graphics.clear();
            this.sp.loadImage("texture/game/candy_" + Global.srcType + "/candy_0.png");
            Laya.Tween.to(this.sp,{scaleX:1},300,Laya.Ease.quintOut, Laya.Handler.create(this, function(){
            }));
        };
        Laya.Tween.to(this.sp,{scaleX:0},50,null,Laya.Handler.create(this,func));
    };
    Candy.prototype.setFront = function (type) {
        if(this.isRolling) return; 
        if(Global.isMusicOn) Laya.SoundManager.playSound("sound/flip.mp3");

        if(type == 0){
            this.rollingTime = 350;
            var func1 = function(){
                this.rollingTime -= 20;
            }
            Laya.timer.loop(20,this,func1);
            Laya.timer.once(340,this,function(){
                Laya.timer.clear(this,func1);
            });
            var func = function(){
                this.sp.graphics.clear();
                this.sp.loadImage("texture/game/candy_" + Global.srcType + "/candy_" + this.type + ".png");
                Laya.Tween.to(this.sp,{scaleX:1},300,Laya.Ease.quintOut, Laya.Handler.create(this, function(){
                    this.isRolling = false;
                }));
            };
            this.isRolling = true;
            Laya.Tween.to(this.sp,{scaleX:0},50,null,Laya.Handler.create(this,func));
        }
        else if(type == 1){
            this.rollingTime = 80;
            var func1 = function(){
                this.rollingTime -= 20;
            }
            Laya.timer.loop(20,this,func1);
            Laya.timer.once(90,this,function(){
                Laya.timer.clear(this,func1);
            });
            var func = function(){
                this.sp.graphics.clear();
                this.sp.loadImage("texture/game/candy_" + Global.srcType + "/candy_" + this.type + ".png");
                Laya.Tween.to(this.sp,{scaleX:1},40,null, Laya.Handler.create(this, function(){
                    this.isRolling = false;
                }));
            };
            this.isRolling = true;
            Laya.Tween.to(this.sp,{scaleX:0},40,null,Laya.Handler.create(this,func));
        }
    };
    Candy.prototype.displayBroder = function(color){
        var broder = new Laya.Sprite();
        broder.loadImage("texture/game/broder_" + color + ".png");
        broder.pivot(broder.width / 2, broder.height / 2);
        broder.pos(this.x - 5, this.y - 10);
        broder.zOrder = 1000;
        this.parent.addChild(broder);

        img = Laya.loader.getRes("texture/game/broder_1.png");

        Laya.Tween.to(broder, {scaleX:1.3,scaleY:1.3,alpha:0}, 500, null, Laya.Handler.create(this,function(broder, color){
            this.parent.removeChild(broder);
        },[broder, color]));

        Laya.timer.once(100, this, function(){
            var broder = new Laya.Sprite();
            broder.loadImage("texture/game/broder_" + color + ".png");
            broder.pivot(broder.width / 2, broder.height / 2);
            broder.pos(this.x - 5, this.y - 10);
            broder.zOrder = 1000;
            this.parent.addChild(broder);

            Laya.Tween.to(broder, {scaleX:1.3,scaleY:1.3,alpha:0}, 500, null, Laya.Handler.create(this,function(broder, color){
                this.parent.removeChild(broder);
            },[broder, color]));

            var func = function(){
                Laya.Tween.to(this,{scaleX:0, scaleY: 0, alpha: 0}, 150);
            };
            Laya.timer.once(2000,this, function(){
                this.removeSelf();
            });
            Laya.Tween.to(this, {scaleX:1.2,scaleY:1.2},150, null, Laya.Handler.create(this, func));
            
        });
    };
    return Candy;
}(Laya.Sprite));
