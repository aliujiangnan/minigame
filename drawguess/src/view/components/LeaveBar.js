/*
* LeaveBar;
*/
var LeaveBar = (function (_super) {
    function LeaveBar(btn) {
        LeaveBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width/2,this.height / 2);
        this.initSelf();

    }
    Laya.class(LeaveBar, "LeaveBar", _super);

    var __proto = LeaveBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_skip.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height * 0.4);
        this.addChild(bg);
        this.bg = bg;
        var resArr = ["btn_yap.png","btn_no.png"]
        for (var j = 0; j < 2; ++j) {
            var btn = new Laya.Button("res/box/" + resArr[j]);
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.zOrder = 100;
            btn.scale(Global.scaleX, Global.scaleY);
            btn.pos(bg.width / 2  + 130 * (j - 0.5) * 2, 273);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [j], false)
            bg.addChild(btn);
        }

        bg.scale(0.7, 0.7);
        Laya.Tween.to(bg, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(bg, { scaleX: 1, scaleY: 1 }, 75);
        }));
    }
    __proto.btnFunc = function (index) {
        switch(index){
            case 0:
                break;
            case 1:
                this.parent.drawView.clearCanvas();
                this.removeSelf();
                this.destroy();
                break;
        }
    }
    return LeaveBar;
}(Laya.View));