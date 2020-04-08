/*
* DefeatBox;
*/
var DefeatBox = (function (_super) {
    function DefeatBox(btn) {
        DefeatBox.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.3);
        this.scale(Global.scaleX, Global.scaleY);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.initSelf();
        this.btn = btn;
        this.scale(0.7 * Global.scaleX, 0.7 * Global.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* Global.scaleX, scaleY: 1.2 * Global.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* Global.scaleX, scaleY: 1 * Global.scaleY}, 100);
        }));
    }

    Laya.class(DefeatBox, "DefeatBox", _super);

    var __proto = DefeatBox.prototype;
    __proto.initSelf = function () {
        var panel = new Laya.Sprite();
        panel.graphics.drawRect(0,0,750,1334,"#000000");
        panel.alpha = 0.5;
        this.addChild(panel);
        this.panel = panel;

        this.mouseThrough = false;
        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_msgBox_1.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var txt = new Laya.Sprite();
        txt.loadImage("texture/game/txt_defeat.png");
        txt.pivot(txt.width / 2, txt.height / 2);
        txt.pos(this.width / 2, this.height * 0.37);
        this.addChild(txt);

        var yesBtn = new Laya.Button("texture/game/btn_yes.png");
        yesBtn.anchorX = 0.5;
        yesBtn.anchorY = 0.5;
        yesBtn.pos(this.width * 0.3, this.height * 0.67);
        yesBtn.stateNum = 3;
        yesBtn.name = "btn_yes";
        yesBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [yesBtn]);
        this.addChild(yesBtn);

        var noBtn = new Laya.Button("texture/game/btn_no.png");
        noBtn.anchorX = 0.5;
        noBtn.anchorY = 0.5;
        noBtn.pos(this.width * 0.7, this.height * 0.67);
        noBtn.stateNum = 3;
        noBtn.name = "btn_no";
        noBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [noBtn]);
        this.addChild(noBtn);
    };

    __proto.onBtnFunc = function (sender) {
        switch (sender.name) {
            case "btn_yes":
                this.removeSelf();
                break;
            case "btn_no":
                this.btn.mouseEnabled = true;
                this.removeSelf();
                break;
        }
    };
    
    return DefeatBox;
}(Laya.View));