/*
* DisConnBox;
*/
var DisConnBox = (function (_super) {
    function DisConnBox(callBack, enterType) {
        DisConnBox.super(this);
        this.width = Laya.stage.width;
        this.height = Laya.stage.height * 0.3;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.scaleY = GameData.scaleY;
        this.scaleX = GameData.scaleX;
        this.enterType = enterType;
        this.initSelf(callBack);
        
        this.scale(0.7 * GameData.scaleX, 0.7 * GameData.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* GameData.scaleX, scaleY: 1.2 * GameData.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* GameData.scaleX, scaleY: 1 * GameData.scaleY}, 100);
        }));
    }
    Laya.class(DisConnBox, "DisConnBox", _super);
    DisConnBox.prototype.initSelf = function (callBack) {
        if(this.enterType == 1){
            var panel = new Laya.Sprite();
            panel.graphics.drawRect(0,0,750,1334,"#000000");
            panel.alpha = 0.5;
            Laya.stage.addChild(panel);
            panel.zOrder = 1999;
            this.panel = panel;
        }

        this.mouseThrough = false;
        var img = Laya.loader.getRes("res/bg_msgBox_1.png");
        var bg = new Laya.Sprite();
        bg.loadImage("res/bg_msgBox_1.png");
        bg.pivotX = img.width / 2;
        bg.pivotY = img.height / 2;
        bg.x = this.width / 2;
        bg.y = this.height / 2;
        this.addChild(bg);

        img = Laya.loader.getRes("res/txt_disconn_1.png");
        var txt = new Laya.Sprite();
        txt.loadImage("res/txt_disconn_1.png");
        txt.pivotX = img.width / 2;
        txt.pivotY = img.height / 2;
        txt.x = this.width / 2;
        txt.y = this.height * 0.37;
        this.addChild(txt);

        var btnYes = new Laya.Button("res/btn_ok.png");
        btnYes.anchorX = 0.5;
        btnYes.anchorY = 0.5;
        btnYes.x = this.width * 0.5;
        btnYes.y = this.height * 0.67;
        btnYes.stateNum = 3;
        btnYes.name = "btn_yes";
        btnYes.clickHandler = new Laya.Handler(this, this.onBtnFunc, [btnYes, callBack]);
        this.addChild(btnYes);
    };
    DisConnBox.prototype.onBtnFunc = function (sender, callBack) {
        switch (sender.name) {
            case "btn_yes":
                if(callBack) callBack();
                this.removeSelf();
                this.destroy();
                if(this.panel) this.panel.removeSelf();
                break;
            case "btn_no":
                this.removeSelf();
                break;
        }
    };
    return DisConnBox;
}(Laya.View));