/*
* ObserverBar;
*/
var ObserverBar = (function (_super) {
    
    function ObserverBar(btn) {
        ObserverBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.btn = btn;
        this.initSelf();
    }
    Laya.class(ObserverBar, "ObserverBar", _super);

    var __proto = ObserverBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_observer.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height * 0.13 - 20);
        bg.size(bg.width, bg.height);
        this.addChild(bg);
        this.bg = bg;
        this.mouseThrough = true;

        var line = new Laya.Sprite();
        line.loadImage("res/box/line.png");
        line.pivot(line.width / 2, line.height / 2);
        line.pos(76 + 112 / 2, 57);
        bg.addChild(line);

        var btn = new Laya.Button("res/box/bg_head_1.png");
        btn.anchorX = 0.5;
        btn.anchorY = 0.5;
        btn.stateNum = 1;
        btn.pos(76 + 112 * 0 + (-5), 57);
        btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [0], false)
        bg.addChild(btn);
        this.standBtn = btn;
        this.bg = bg;
        this.heads = [];
        var j = 0;
        for (var i = 0; i < NetMgr.instance.getObsNum(); ++i) {
            var obser = NetMgr.instance.getObser(i);
            if(obser.online && !seat.isPlayer){
                var isSelf = obser.userId == UserMgr.instance.userId;
                var headBg = new Laya.Sprite();
                headBg.loadImage("res/box/bg_head_1.png");
                headBg.pivot(headBg.width / 2, headBg.height / 2);
                headBg.pos(76 + 112 * (isSelf? 0 : j+1) + (isSelf? -5 : 5), 57);
                headBg.scale(Global.scaleX * 1.2, Global.scaleY * 1.2);
                this.bg.addChild(headBg);

                var head = new Head(obser.nickName,obser.sex,obser.avatar,0);
                head.pos(headBg.x, headBg.y);
                head.scaleX *= 0.8;
                head.scaleY *= 0.8;
                this.bg.addChild(head);
                this.heads.push({sp:headBg,head:head});
                if(!isSelf)j++;
            }
        }
    }

    __proto.showSelf = function(){
        this.visible = true;
        this.scale(0.7, 0.7);
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 75);
        }));
    };

    __proto.btnFunc = function (index) {
        if (index == 0 && NetMgr.instance.isPlayer) {
            NetMgr.instance.send('standup');
        }
    }

    __proto.refreshUser = function(){
        for(var i = 0; i < this.heads.length; ++i){
            this.heads[i].sp.removeSelf();
            this.heads[i].sp.destroy();
            this.heads[i].head.removeSelf();
            this.heads[i].head.destroy();
        }

        this.heads = [];
        
        var j = 0;
        for (var i = 0; i < NetMgr.instance.getObsNum(); ++i) {
            var obser = NetMgr.instance.getObser(i);
            if(obser.online){
                var isSelf = obser.userId == UserMgr.instance.userId;
                var headBg = new Laya.Sprite();
                headBg.loadImage("res/box/bg_head_1.png");
                headBg.pivot(headBg.width / 2, headBg.height / 2);
                headBg.pos(76 + 112 * (isSelf? 0 : j+1) + (isSelf? -5 : 5), 57);
                headBg.scale(Global.scaleX * 1.2, Global.scaleY * 1.2);
                this.bg.addChild(headBg);

                var head = new Head(obser.nickName,null,null,0);
                head.pos(headBg.x, headBg.y);
                head.scaleX *= 0.8;
                head.scaleY *= 0.8;
                this.bg.addChild(head);
                this.heads.push({sp:headBg,head:head});
                if(!isSelf)j++;
            }
        }
    }
    return ObserverBar;
}(Laya.View));