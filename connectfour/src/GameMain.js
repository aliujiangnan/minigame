/*
* GameMain;
*/
var GameMain = (function () {
    function GameMain() {
        this.initLaya();
    };
    var __proto = GameMain.prototype;
    __proto.initLaya = function () {
        Laya.init(Global.stageWidth, Global.stageHeight);
        Laya.stage.bgColor = "#1ed3dd";
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        var r = Global.stageWidth / Global.stageHeight;
        var br = Laya.Browser.width / Laya.Browser.height;
        Global.scaleY = br < r ? br / r : 1;
        Global.scaleX = br > r ? r / br : 1;
        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;

        Laya.stage.addChild(new LoadView());  
    };
    
    return GameMain;
}());

new GameMain();
