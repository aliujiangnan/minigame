/*
* DisConnBox;
*/
var DisConnBox = (function (_super) {
    function DisConnBox(callBack, enterType) {
        DisConnBox.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.3);
        this.scale(Global.scaleX, Global.scaleY);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.enterType = enterType;
        this.initSelf(callBack);
        this.scale(0.7 * Global.scaleX, 0.7 * Global.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* Global.scaleX, scaleY: 1.2 * Global.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* Global.scaleX, scaleY: 1 * Global.scaleY}, 100);
        }));
    }

    Laya.class(DisConnBox, "DisConnBox", _super);

    var __proto = DisConnBox.prototype;
    __proto.initSelf = function (callBack) {
        if(this.enterType == 1){
            var panel = new Laya.Sprite();
            panel.graphics.drawRect(0,0,750,1334,"#000000");
            panel.alpha = 0.5;
            Laya.stage.addChild(panel);
            panel.zOrder = 1999;
            this.panel = panel;
        }

        this.mouseThrough = false;

        bg.loadImage("texture/game/bg_msgBox_1.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var txt = new Laya.Sprite();
        txt.loadImage("texture/game/txt_disconn_1.png");
        txt.pivot(txt.width / 2, txt.height / 2);
        txt.pos(this.width / 2, this.height * 0.37);
        this.addChild(txt);

        var okBtn = new Laya.Button("texture/game/btn_ok.png");
        okBtn.anchorX = 0.5;
        okBtn.anchorY = 0.5;
        okBtn.pos(this.width * 0.5, this.height * 0.67);
        okBtn.stateNum = 3;
        okBtn.name = "btn_yes";
        okBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [okBtn, callBack]);
        this.addChild(okBtn);
    };

    __proto.onBtnFunc = function (sender, callBack) {
        switch (sender.name) {
            case "btn_yes":
                if(callBack) callBack();
                this.removeSelf();
                this.destroy();
                break;
            case "btn_no":
                this.removeSelf();
                break;
        }
    };
    
    return DisConnBox;
}(Laya.View));