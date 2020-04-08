
/*
* AnswerView;
*/
var AnswerView = (function (_super) {
    function AnswerView(canvaSrc, word) {
        AnswerView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width / 2, this.height / 2);
        this.initSelf(canvaSrc, word);

        this.scale(0.7, 0.7);
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 75);
        }));
    }
    Laya.class(AnswerView, "AnswerView", _super);

    var __proto = AnswerView.prototype;
    __proto.initSelf = function (canvaSrc, word) {
        var mask = new Laya.Sprite();
        mask.graphics.drawRect(0, 0, 750, 1334, "#000000");
        mask.alpha = 0.5;
        mask.pivot(375, 667);
        mask.pos(375, 667);
        mask.scale(2, 2);
        this.addChild(mask);

        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_answer.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var headBg = new Laya.Sprite();
        headBg.loadImage("res/box/bg_head.png");
        headBg.pivot(headBg.width / 2, headBg.height / 2);
        headBg.pos(110, 789);
        headBg.scale(Global.scaleX * 0.8, Global.scaleY * 0.8);
        bg.addChild(headBg);

        var seat = NetMgr.instance.getPainter();
        var head = new Head(seat.nickName,seat.sex,seat.avatar,3);
        head.pos(headBg.x, headBg.y);
        bg.addChild(head);

        var sp = new Laya.Sprite();
        sp.pos(37, 103);
        bg.addChild(sp);
        if(canvaSrc)sp.loadImage(canvaSrc, 0, 0, 659, 632);

        this.mouseThrough = true;
        var btn = new Laya.Button("res/box/btn_save.png");
        btn.anchorX = 0.5;
        btn.anchorY = 1;
        btn.stateNum = 1;
        btn.zOrder = 100;
        btn.pos(bg.width / 2, 830);
        btn.clickHandler = Laya.Handler.create(this, function () {
            //
        });
        
        bg.addChild(btn);

        var txt = new Laya.Text();
        txt.color = "#ffffff";
        txt.text = word ? word : "ABCabc";
        txt.fontSize = 50;
        txt.width = 500;
        txt.pivotX = 250;
        txt.align = "center";
        txt.pos(bg.width / 2, 15);
        bg.addChild(txt);
    };

    return AnswerView;
}(Laya.View));
