/*
* Pawn;
*/
var Pawn = (function (_super) {
    function Pawn(color) {
        Pawn.super(this);
        this.color = color;
        this.initSelf();
    }
    
    Laya.class(Pawn,"Pawn",_super);

    var __proto = Pawn.prototype;
    __proto.initSelf = function () {
        this.loadImage("texture/game/pawn_"+ this.color + ".png");
        this.pivot(this.width / 2, this.height / 2);
    };

    return Pawn;
}(Laya.Sprite));