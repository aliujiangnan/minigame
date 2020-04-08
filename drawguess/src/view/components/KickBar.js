/*
* KickBar;
*/
var KickBar = (function (_super) {
    function KickBar(type,index) {
        KickBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width/2,this.height / 2);
        this.type = type;
        this.index = index;
        this.initSelf(type,index);
    }
    Laya.class(KickBar, "KickBar", _super);

    var __proto = KickBar.prototype;
    __proto.initSelf = function (type,index) {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_kick_"+type+".png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height * 0.4);
        this.addChild(bg);
        this.bg = bg;
        var resArr = ["btn_yap.png","btn_cancel.png"]
        for (var j = 0; j < (type == 0 ? 1 : 2); ++j) {
            var btn = new Laya.Button("res/box/" + resArr[j]);
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.zOrder = 100;
            btn.scale(Global.scaleX, Global.scaleY);
            btn.pos(bg.width / 2  + (type == 0 ? 0 : 130 * (j - 0.5) * 2), (type == 0 ? 230 : 280));
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
                if(this.type == 1){
                    NetMgr.instance.send('kick', {id:NetMgr.instance.getSeat(this.index).userId});
                    this.removeSelf();
                }
                else{
                    this.parent.exitRoom();
                    this.removeSelf();
                }
                break;
            case 1:
                this.removeSelf();
                break;
        }
    }
    return KickBar;
}(Laya.View));