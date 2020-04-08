/*
* Player;
*/
var Player = (function (_super) {
    function Player(type) {
        Player.super(this);
        this.type = type;
        this.initSelf();
        this.scale(Global.scaleX, Global.scaleY);
    }
    
    Laya.class(Player,"Player",_super);

    var __proto = Player.prototype;
    __proto.initSelf = function(){
        this.size(135,135);
        this.pivot(this.width / 2,this.height / 2);

        var head = new Laya.Sprite();
        head.zOrder = 10;
        head.loadImage("texture/game/head_1.png", 0, 0, this.width, this.height);

        this.addChild(head);

        var head1 = new Laya.Sprite();
        head1.zOrder = 10;
        head1.loadImage(this.type == 0 ? UserMgr.instance.avatar : NetMgr.instance.getOpponent().avatar, 0, 0, this.width, this.height, Laya.Handler.create(this,function(){
            head.graphics.drawCircle(this.width/2,this.width/2,this.width/2,"#ffffff");
        }));

        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(0,0,this.width / 2,"#ffffff");
        mask.pos(this.width / 2,this.height / 2);
        head1.mask = mask;

        this.addChild(head1);
        
        var round = new Laya.Sprite();
        round.zOrder = 10;
        round.loadImage("texture/game/round_"+this.type+".png");
        round.pivot(146/2,146/2);
        round.pos(this.width/2,this.height/2);
        this.addChild(round);

        this.scaleY = Global.scaleY;

    };
    __proto.location = function(row, column){
        this.row = row;
        this.column = column;
    };
    __proto.playSpray = function(){
        var anim = new Laya.Animation();
        anim.play(0, true, "res/spray/spray.ani#");
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(this.width / 2, this.height / 2);
        anim.interval = 300;
        this.addChild(anim);
        
    };
    return Player;
}(Laya.Sprite));