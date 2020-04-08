
/*
* SelectBar;
*/
var SelectBar = (function (_super) {
    function SelectBar() {
        SelectBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width / 2, this.height / 2);
        this.initSelf();
    }
    Laya.class(SelectBar, "SelectBar", _super);

    var __proto = SelectBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_selecting.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var headBg = new Laya.Sprite();
        headBg.loadImage("res/box/bg_head.png");
        headBg.pivot(headBg.width / 2, headBg.height / 2);
        headBg.pos(64, bg.height/2);
        headBg.scale(Global.scaleX, Global.scaleY);
        bg.addChild(headBg);

        var painter = NetMgr.instance.getPainter();
        var head = new Head(painter.nickName,painter.sex,painter.avatar,2);
        head.pos(headBg.x, headBg.y);
        bg.addChild(head);
        head.nameTxt.y -= 30;

        var select = new Laya.Sprite();
        select.loadImage("res/box/selecting.png");
        select.pivot(select.width / 2, select.height / 2);
        select.pos(200, bg.height * 0.7);
        bg.addChild(select);

        bg.scale(0.7, 0.7);
        Laya.Tween.to(bg, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(bg, { scaleX: 1, scaleY: 1 }, 75);
        }));
    };
    return SelectBar;
}(Laya.View));
