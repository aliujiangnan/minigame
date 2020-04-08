/*
* Brick;
*/
var Brick = (function (_super) {
    function Brick(type) {
        Brick.super(this);
        this.type = type;
        this.hp = type == 4 ? 1 : 2;
        this.initSelf();
    }
    
    Laya.class(Brick,"Brick",_super);

    var __proto = Brick.prototype;
    __proto.initSelf = function(){
        this.loadImage("texture/game/brick_" + this.type + ".png");
        this.pivot(this.width / 2,this.height / 2);
    };
    __proto.break = function(){
        var broken = new Laya.Sprite();
        broken.loadImage("texture/game/broken.png");
        broken.pivot(broken.width / 2, broken.height / 2);
        broken.pos(this.width / 2, this.height / 2);
        this.addChild(broken);
    };
    __proto.showTrailing = function(){
        var trail = new Laya.Sprite();
        trail.loadImage("texture/game/trailing_" + this.type + ".png");
        trail.pivot(trail.width / 2,trail.height / 2);
        trail.pos(this.width / 2, this.height + trail.height / 2);
        trail.name = "trailing";
        this.addChild(trail);
    };
    __proto.hiddenTrailing = function(){
        this.removeChildByName("trailing");
    }
    return Brick;
}(Laya.Sprite));