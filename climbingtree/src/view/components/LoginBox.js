/*
* LoginBox;
*/
var LoginBox = (function (_super) {
    function LoginBox(callBack, enterType) {
        LoginBox.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.3);
        this.scale(Global.scaleY, Global.scaleX);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.enterType = enterType;
        this.initSelf(callBack);
        
        this.scale(0.7 * Global.scaleX, 0.7 * Global.scaleY);
        Laya.Tween.to(this, { scaleX: 1.2* Global.scaleX, scaleY: 1.2 * Global.scaleY}, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1* Global.scaleX, scaleY: 1 * Global.scaleY}, 100);
        }));
    }
    Laya.class(LoginBox, "LoginBox", _super);
    LoginBox.prototype.initSelf = function (callBack) {
        var bg=new Laya.Sprite();
        bg.loadImage("gamescreen/match/bg_black.png");
        bg.zOrder = 1999;
        bg.name = "loginSp";
        Laya.stage.addChild(bg);
        bg.alpha = 0;
        bg.mouseThrough = false;
        bg.on("mousedown",this,function(){});
        Laya.Tween.to(bg,{alpha:1},300);

        this.mouseThrough = false;
        var bg1 = new Laya.Sprite();
        bg1.loadImage("res/bg_msgBox_1.png");
        bg1.pivot(bg1.width / 2, bg1.height / 2);
        bg1.pos(this.width / 2, this.height / 2);
        bg1.size(bg1.width,bg1.height);
        this.addChild(bg1);

        var prepar = new Laya.Sprite();
        prepar.loadImage("res/preparing.png");
        prepar.pivot(prepar.width / 2, prepar.height / 2);
        prepar.pos(this.width / 2 - 80, this.height * 0.37);
        prepar.scale(1.2,1.2);
        this.addChild(prepar);

        var ani = new Laya.Sprite();
        ani.loadImage("res/ani1.png");
        ani.pivot(ani.width / 2, ani.height / 2);
        ani.pos(bg1.width-5, bg1.height-8);
        bg1.addChild(ani);

        var count = 1;
        Laya.timer.loop(150,this,function(){
            if(count>3)count=1;
            ani.graphics.clear();
            ani.loadImage("res/ani"+count+".png");
            count++;
        })

        var btnYes = new Laya.Button("res/btn_ok.png");
        btnYes.anchorX = 0.5;
        btnYes.anchorY = 0.5;
        btnYes.pos(this.width * 0.5, this.height * 0.6);
        btnYes.stateNum = 1;
        btnYes.name = "btn_yes";
        btnYes.clickHandler = new Laya.Handler(this, this.onBtnFunc, [btnYes, callBack]);
    };
    LoginBox.prototype.onBtnFunc = function (sender, callBack) {
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
    return LoginBox;
}(Laya.View));