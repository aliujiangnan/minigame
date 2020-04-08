/*
* Shark;
*/
var Shark = (function (_super) {
    function Shark(direction) {
        Shark.super(this);
        this.direction = direction;
        this.initSelf();
    }

    Laya.class(Shark,"Shark",_super);

    var __proto = Shark.prototype;
    __proto.initSelf = function(){
        var width = 180, height = 281;
        var _width = 90, _height = 220;

        var b = this.direction == 0 || this.direction == 2;
        this.rectWidth = b ? _width : _width ;
        this.rectHeight = b ? _width : _width;
        this.rectWidth *= Global.scaleX;
        this.rectHeight *= Global.scaleY;
        this.size(b ? height : width, b ? width : height);
        this.pivot(this.width / 2, this.width / 2);
        
        var sp = new Laya.Sprite();
        sp.pivot(width / 2, height / 2);
        sp.pos(width / 2, height / 2);
        this.addChild(sp);

        var rect = new Laya.Sprite();
        rect.pivot(_width / 2, _width / 2);
        rect.pos(width / 2, height / 2 - 35);
        sp.addChild(rect);

        var anim = new Laya.Animation();
        anim.pivot(width / 2, height / 2);
        anim.pos(width / 2, height / 2);
        sp.addChild(anim);
        anim.play(0, true, "res/shayu/shayu.ani#");
        this.anim = anim;
        
        if(this.direction == 0) {
            sp.rotation = -90;
        }      
        else if(this.direction == 2) {
            sp.rotation = 90;
        }   
        else if(this.direction == 1) { 
        }
        else if(this.direction == 3) { 
            sp.rotation = -180;
        }

        this.scaleY = Global.scaleY;
    };
    __proto.getRectOrign = function(){
        if(this.direction == 0){
            return {x:this.x - 50 + 60, y:this.y};
        }
        else if(this.direction == 2){
            return {x:this.x - 50 - 60, y:this.y};
        }
        else if(this.direction == 1){
            return {x:this.x, y:this.y + 50 + 60}; 
        }
        else if(this.direction == 3){
            return {x:this.x, y:this.y + 50 - 60}; 
        }
    };
    __proto.playEat = function (){
        this.anim.stop();
        this.anim.play(0, false, "res/shkes_eat/shkes_eat.ani#");
    };
    return Shark;
}(Laya.Sprite));