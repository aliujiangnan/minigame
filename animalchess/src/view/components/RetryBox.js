/*
* RetryBox;
*/
var RetryBox = (function (_super) {
    function RetryBox(callBack,arg1) {
        RetryBox.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.3);
        this.scale(Global.scaleY, Global.scaleX);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.initSelf(callBack,arg1);

        this.scale(0.7 * GameData.scaleX, 0.7 * GameData.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* GameData.scaleX, scaleY: 1.2 * GameData.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* GameData.scaleX, scaleY: 1 * GameData.scaleY}, 100);
        }));
    }

    Laya.class(RetryBox, "RetryBox", _super);
    var __proto = RetryBox.prototype;
    __proto.initSelf = function (callBack,arg1) {
        var panel = new Laya.Sprite();
        panel.graphics.drawRect(0,0,750,1334,"#000000");
        panel.alpha = 0.5;
        Laya.stage.addChild(panel);
        panel.zOrder = 1999;
        this.panel = panel;

        this.mouseThrough = false;
        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_msgBox_1.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var txt = new Laya.Sprite();
        txt.loadImage("texture/game/txt_disconn_1.png");
        txt.pivot(txt.width / 2, txt.height / 2);
        txt.pos(this.width / 2, this.height * 0.37);
        this.addChild(txt);

        var retryBtn = new Laya.Button("texture/game/btn_retry.png");
        retryBtn.anchorX = 0.5;
        retryBtn.anchorY = 0.5;
        retryBtn.pos(this.width * 0.5, this.height * 0.67);
        retryBtn.stateNum = 3;
        retryBtn.name = "btn_yes";
        retryBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [retryBtn, callBack,arg1]);
        this.addChild(retryBtn);
    };

    __proto.onBtnFunc = function (sender, callBack,arg1) {
        switch (sender.name) {
            case "btn_yes":
                if(callBack) callBack(arg1);
                this.removeSelf();
                this.destroy();
                this.panel.removeSelf();
                break;
            case "btn_no":
                this.removeSelf();
                this.panel.removeSelf();
                break;
        }
    };
    
    return RetryBox;
}(Laya.View));