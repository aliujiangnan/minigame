/*
* PenBar;
*/
var PenBar = (function (_super) {
    function PenBar(btn) {
        PenBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.btn = btn;
        this.initSelf();

    }
    Laya.class(PenBar, "PenBar", _super);

    var __proto = PenBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_pen.png");
        bg.pivot(0, bg.height);
        bg.pos(10, this.height * 0.7 - 20);
        this.addChild(bg);
        this.bg = bg;
        this.mouseThrough = true;
        for (var j = 0; j < 5; ++j) {
            var btn = new Laya.Button("res/box/pen_" + (j + 1) + ".png");
            btn.anchorX = 0.5;
            btn.anchorY = 1;
            btn.stateNum = 1;
            btn.zOrder = 100;
            btn.scaleX = Global.scaleX;
            btn.scaleY = Global.scaleY;
            btn.pos(66 + 100 * j, 103);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [j - 1], false)
            bg.addChild(btn);
        }


    }

    __proto.showSelf = function () {
        this.visible = true;
        this.bg.scale(0, 0);
        Laya.Tween.to(this.bg, { scaleX: 1.1, scaleY: 1.1 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.bg, { scaleX: 1, scaleY: 1 }, 75);
        }));
    }

    __proto.btnFunc = function (index) {
        Global.widthIndex = index;
        Painter.ctx.lineWidth = Global.widthList[Global.widthIndex];//画笔粗细

        var data = {
            type: "sel_wid",
            idx: index,
        }
        NetMgr.instance.send('tool', data);

        this.parent.drawView.clearCanvas();
        this.visible = false;
        this.btn.skin = "res/draw/btn_pen_2.png";

    }
    return PenBar;
}(Laya.View));