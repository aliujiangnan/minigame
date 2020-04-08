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
        sp.pivot(13.5, 13.5);
        sp.pos(13.5, 13.5);
        sp.loadImage("texture/game/player_" + this.type + ".png");
        this.addChild(sp);
    };

    return Player;
}(Laya.Sprite));