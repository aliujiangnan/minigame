/*
* Player;
*/
var Player = (function (_super) {
    function Player(type) {
        Player.super(this);
        this.type = type;
        this.initSelf();
    }

    Laya.class(Player, "Player", _super);

    var __proto = Player.prototype;
    __proto.initSelf = function () {
        var sp = new Laya.Sprite();
        sp.loadImage("texture/game/player_" + this.type + ".png");
        sp.zOrder = 101;
        this.addChild(sp);
        this.pivot(sp.width / 2, sp.height / 2);
        this.size(sp.width, sp.height);
    };

    return Player;
}(Laya.Sprite));