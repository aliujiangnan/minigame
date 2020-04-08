/*
* Dollars;
*/
var Dollars = (function (_super) {
    function Dollars(type) {
        Dollars.super(this);
        this.num = 0;
        this.initSelf();
    }

    Laya.class(Dollars, "Dollars", _super);

    var __proto = Dollars.prototype;
    __proto.initSelf = function () {

        var dollar = new Laya.Sprite();
        dollar.loadImage("texture/game/dollar_2.png");
        dollar.pivot(dollar.width / 2, dollar.height / 2);
        dollar.pos(270 / 2, 600);
        dollar.name = "dollar";
        this.addChild(dollar);

        var shadow = new Laya.Sprite();
        shadow.loadImage("texture/game/shadow.png");
        shadow.pivot(shadow.width / 2, shadow.height / 2);
        shadow.pos(270 / 2, 600 + dollar.height / 2 + shadow.height / 2);
        shadow.name = "shadow";
        this.addChild(shadow);
        

        var panel = new Laya.Sprite();
        this.addChild(panel);
        var side = new Laya.Sprite();
        side.loadImage("texture/game/side.png");
        side.pivot(side.width / 2, side.height);
        side.size(side.width,side.height);
        panel.addChild(side);
        this.side = side;
        this.sideHeight = side.height;
        this.side.scaleY = this.num * 1 / this.sideHeight;

        this.pivot(side.width / 2, Laya.stage.height * 0.5);
        this.size(side.width, Laya.stage.height * 0.5);
        side.pos(this.width / 2, 0);

        var dollar1 = new Laya.Sprite();
        dollar1.loadImage("texture/game/dollar_2.png");
        dollar1.pivot(dollar1.width / 2, dollar1.height / 2);
        dollar1.pos(this.width / 2 - 0.5, this.side.y - (this.side.height * this.side.scaleY + dollar1.height / 2) + 2);
        panel.addChild(dollar1);
        this.dollar = dollar1;

        panel.pivot(this.width / 2, (this.side.height * this.side.scaleY + this.dollar.height) / 2);
        panel.height = this.side.height * this.side.scaleY + this.dollar.height;
        panel.pos(this.width / 2, panel.height / 2 + this.height - this.dollar.height.height / 2);
        this.panel = panel;

    };

    __proto.addDollar = function (isPlayFnt) {
        this.num += 2;
        var num = this.num >= 230 ? 230 : this.num;
        var scaleY = num * 1 / this.sideHeight;
        var y = this.side.y - (this.side.height * this.side.scaleY + this.dollar.height / 2) + 2;
        var r = parseInt(Math.random() * 3) + 2;
        var y1 = r == 2 ? y : y - 20;

        var dollar = new Laya.Sprite();
        dollar.loadImage("texture/game/dollar_" + r + ".png");
        dollar.pivot(dollar.width / 2, dollar.height / 2);
        dollar.pos(this.width / 2 - 0.5, y1 - 400);
        this.panel.addChild(dollar);

        var panel = this.panel;
        Laya.Tween.to(dollar, { y: y1 }, 500, null, Laya.Handler.create(this, function () {
            this.side.scaleY = scaleY;
            this.dollar.y = y;
            dollar.removeSelf();
            dollar.destroy();

            this.removeChildByName("dollar")
            this.panel.pivotY = (this.side.height * this.side.scaleY + this.dollar.height) / 2;
            this.panel.height = this.side.height * this.side.scaleY + this.dollar.height;
            this.panel.y = this.panel.height / 2 + this.height - this.dollar.height / 2;

            this.removeChildByName("shadow");

            if (this.panel.getChildByName("shadow1") == null) {
                var shadow = new Laya.Sprite();
                shadow.loadImage("texture/game/shadow.png");
                shadow.pivot(shadow.width / 2, shadow.height / 2);
                shadow.pos(270 / 2, shadow.height / 2);
                shadow.name = "shadow1";
                this.panel.addChild(shadow);
            }

        }.bind(this)))

        if (!isPlayFnt) return;

        var txt = new Laya.Text();
        txt.text = "+" + 100 + "$";
        txt.width = 500;
        txt.fontSize = 50;
        txt.font = "sz4-laya";
        txt.wordWrap = true;
        txt.align = "left";
        txt.pos(this.x - this.pivotX + 0, this.y - this.pivotY + 600);
        txt.zOrder = 101;
        this.parent.addChild(txt);

        Laya.Tween.to(txt, { y: txt.y - 200, alpha: 0 }, 700, null, Laya.Handler.create(this, function () {
            txt.removeSelf();
            txt.destroy();
        }))
    };

    return Dollars;
}(Laya.Sprite));