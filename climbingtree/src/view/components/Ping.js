/*
* Ping;
*/
var Ping = (function (_super) {
    function Ping() {
        Ping.super(this);
        this.size(200, 100);
        this.pivot(this.width / 2, this.height / 2);
        this.initSelf();
        this.scale(Global.scaleX, Global.scaleY);
    }

    Laya.class(Ping, "Ping", _super);
    var __proto = Ping.prototype;
    __proto.initSelf = function () {
        var sp = new Laya.Sprite();
        sp.loadImage("texture/game/xihao1.png");
        sp.pos(this.width / 2, this.height / 2 + 5);
        sp.pivot(sp.width / 2, sp.height / 2);
        sp.scale(0.7, 0.7);
        this.addChild(sp);
        this.sp = sp;

        var txt = new Laya.Text();
        txt.fontSize = 18;
        txt.color = "#78FD17";
        txt.stroke = 1;
        txt.strokeColor = txt.color;
        txt.width = 100;
        txt.pivotX = 50;
        txt.align = "right";
        txt.pos(sp.x - 70, sp.y - 10);
        this.addChild(txt);
        this.txt = txt;

        var callback =function () {
            this.ping = Global.robotType == 0 ? (NetMgr.instance.pings == -1 ? parseInt(Math.random() * 30) + 30 : NetMgr.instance.pings) : parseInt(Math.random() * 30) + 30;
            this.ping = Math.min(this.ping, 999);
            this.txt.text = this.ping + "ms";
            this.txt.color = this.ping < 100 ? "#78FD17" : (this.ping < 999 ? "#E5ED0F" : "#ff4646");
            this.sp.graphics.clear();
            this.sp.loadImage(this.ping < 100 ? "texture/game/xihao1.png" : (this.ping < 999 ? "texture/game/xihao2.png" : "texture/game/xihao3.png"))
            this.txt.strokeColor = this.txt.color;
        }.bind(this);

        Laya.timer.loop(3000, this, callback);
        callback();
    };

    return Ping;
}(Laya.View));