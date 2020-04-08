/*
* ColorBar;
*/
var ColorBar = (function (_super) {
    function ColorBar(btn) {
        ColorBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.initSelf();
        this.btn = btn;
    }
    Laya.class(ColorBar, "ColorBar", _super);

    var __proto = ColorBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_color.png");
        bg.pivot(0, bg.height);
        bg.pos(10, this.height * 0.7 - 20);
        this.addChild(bg);
        this.bg = bg;
        this.mouseThrough = true;
        for (var i = 0; i < 2; ++i) {
            for (var j = 0; j < 5; ++j) {
                var btn = new Laya.Button("res/box/color_" + (5 * i + j + 1) + ".png");
                btn.anchorX = 0.5;
                btn.anchorY = 0.5;
                btn.stateNum = 1;
                btn.zOrder = 100;
                btn.scale(Global.scaleX, Global.scaleY);
                btn.pos(66 + 100 * j, 83 + 100 * i);
                btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [5 * i + j], false)
                bg.addChild(btn);
            }
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
        Global.colorIndex = index;
        Painter.ctx.strokeStyle = Global.colorList[Global.colorIndex];//画笔颜色
        Painter.ctx.fillStyle = Global.colorList[Global.colorIndex];

        var data = {
            type: "sel_col",
            idx: index,
        }
        NetMgr.instance.send('tool', data);

        this.parent.drawView.clearCanvas();
        this.visible = false;
        this.btn.skin = "res/draw/btn_color_2.png";
    }
    return ColorBar;
}(Laya.View));