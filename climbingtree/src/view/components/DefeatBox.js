/*
* DefeatBox;
*/
var DefeatBox = (function (_super) {
    function DefeatBox(btn) {
        DefeatBox.super(this);
        this.width = Laya.stage.width;
        this.height = Laya.stage.height * 0.3;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.scaleY = GameData.scaleY;
        this.scaleX = GameData.scaleX;
        this.initSelf();
        this.btn = btn;
        this.scale(0.7 * GameData.scaleX, 0.7 * GameData.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* GameData.scaleX, scaleY: 1.2 * GameData.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* GameData.scaleX, scaleY: 1 * GameData.scaleY}, 100);
        }));
        this.name = "defeatBox";
    }
    Laya.class(DefeatBox, "DefeatBox", _super);
    DefeatBox.prototype.initSelf = function () {
        
        var panel = new Laya.Sprite();
        panel.graphics.drawRect(0,0,750,1334,"#000000");
        panel.alpha = 0.5;
        Laya.stage.addChild(panel);
        panel.zOrder = 999;
        this.panel = panel;

        this.mouseThrough = false;
        var img = Laya.loader.getRes("res/bg_msgBox_1.png");
        var bg = new Laya.Sprite();
        bg.loadImage("res/bg_msgBox_1.png");
        bg.pivotX = img.width / 2;
        bg.pivotY = img.height / 2;
        bg.x = this.width / 2;
        bg.y = this.height / 2;
        this.addChild(bg);

        img = Laya.loader.getRes("res/txt_defeat.png");
        var txt = new Laya.Sprite();
        txt.loadImage("res/txt_defeat.png");
        txt.pivotX = img.width / 2;
        txt.pivotY = img.height / 2;
        txt.x = this.width / 2;
        txt.y = this.height * 0.37;
        this.addChild(txt);

        var btnYes = new Laya.Button("res/btn_yes.png");
        btnYes.anchorX = 0.5;
        btnYes.anchorY = 0.5;
        btnYes.x = this.width * 0.3;
        btnYes.y = this.height * 0.67;
        btnYes.stateNum = 3;
        btnYes.name = "btn_yes";
        btnYes.clickHandler = new Laya.Handler(this, this.onBtnFunc, [btnYes]);
        this.addChild(btnYes);

        var btnNo = new Laya.Button("res/btn_no.png");
        btnNo.anchorX = 0.5;
        btnNo.anchorY = 0.5;
        btnNo.x = this.width * 0.7;
        btnNo.y = this.height * 0.67;
        btnNo.stateNum = 3;
        btnNo.name = "btn_no";
        btnNo.clickHandler = new Laya.Handler(this, this.onBtnFunc, [btnNo]);
        this.addChild(btnNo);
    };
    DefeatBox.prototype.onBtnFunc = function (sender) {
        switch (sender.name) {
            case "btn_yes":
                BooGame.gracefulQuit();
                this.removeSelf();
                this.panel.removeSelf();
                break;
            case "btn_no":
                this.btn.mouseEnabled = true;
                this.removeSelf();
                this.panel.removeSelf();
                break;
        }
    };
    return DefeatBox;
}(Laya.View));