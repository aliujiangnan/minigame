/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.hasTouched = false;
        this.isMoving = false;
        this.state = "idle";
        this.initListeners();
        this.initSelf();
        this.initView();
    }

    Laya.class(GameView, "GameView", _super);

    var rstData = {
        curlv: 2,           // 当前等级(加上本次游戏经验后)
        curscore: 15,          // 累计后的分数
        befoexp: 10,            // 上局末经验值
        befonext: 30,       // 上局么对应的下一级别经验值
        curexp: 19,           // 当前经验值
        nextexp: 30,            // 下一级别最低经验值
        scoreadd: "-20",           // 本局游戏得分情况
        expadd: "+50",           // 本局游戏经验情况
    }

    var __proto = GameView.prototype;
    __proto.initView = function () {
        var exitBtn = new Laya.Button("texture/game/btn_exit.png");
        exitBtn.scale(Global.scaleX * 1.0, Global.scaleY * 1.0);
        exitBtn.pos(60, 60);
        exitBtn.anchorX = 0.5;
        exitBtn.anchorY = 0.5;
        exitBtn.stateNum = 3;
        exitBtn.zOrder = 50;
        exitBtn.name = "btn_exit";
        exitBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [exitBtn]);
        this.addChild(exitBtn);
        this.exitBtn = exitBtn;

        var mscBtn = new Laya.Button("texture/game/btn_music_0.png");
        mscBtn.scale(Global.scaleX * 1.0, Global.scaleY * 1.0);
        mscBtn.pos(145, 60);
        mscBtn.anchorX = 0.5;
        mscBtn.anchorY = 0.5;
        mscBtn.stateNum = 3;
        mscBtn.zOrder = 50;
        mscBtn.name = "btn_msc";
        mscBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [mscBtn]);
        this.addChild(mscBtn);
        this.pressCount = 0;
        this.mscBtn = mscBtn;

        var ping = new Ping();
        ping.pos(720, 14);
        this.addChild(ping);
    };

    __proto.onBtnFunc = function (sender) {
        switch (sender.name) {
            case "btn_exit":
                // var defeatBox = new DefeatBox(this.exitBtn);
                // defeatBox.pos(Laya.stage.width / 2, this.height * 0.5);
                // defeatBox.zOrder = 100;
                // this.exitBtn.mouseEnabled = false;
                // this.addChild(defeatBox);
                this.gameOver(0);
                // this.displayResult(1,1);
                break;
            case "btn_msc":
                this.pressCount++;
                Global.isMusicOn = this.pressCount % 2 == 0;
                this.mscBtn.skin = "texture/game/btn_music_" + this.pressCount % 2 + ".png";
                break;
        }
    };

    __proto.initListeners = function () {
        this.listeneres = [];

        var addHandler = function(e,h){
            this.listeneres.push({e:e,h:h});
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("player_msg", function (data) {
            switch (data.type) {
                case "add":
                    this.numArr[1] = data.num;
                    this.dollarsArr[1].addDollar(false);
                    this.headBar.setNum(1, data.num);
                    break;
            }
        }.bind(this));

        addHandler("player_emoji", function (data, loc) {
            this.headBar.showEmoji(data.idx, loc)
        }.bind(this));

        EventHelper.instance.once("game_over", this, function (data) {
            this.showOver(data.rst, data.data);
        }.bind(this))
    };

    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg.png");
        bg.y = this.height - bg.height;
        this.addChild(bg);

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 100;
        this.addChild(headBar);
        this.headBar = headBar;

        var timeBar = new TimeBar();
        timeBar.pos(this.width / 2, 180);
        timeBar.zOrder = 100;
        this.addChild(timeBar);
        this.timeBar = timeBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 500;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;

        this.initPanel();
    };

    __proto.onTimeOver = function () {
        if (this.state != "running") return;

        var result = this.dollarsArr[0].num > this.dollarsArr[1].num ? 1 : 0;
        result = this.dollarsArr[0].num == this.dollarsArr[1].num ? 2 : result;
        this.gameOver(result);
    };
    __proto.initPanel = function () {
        this.panel = new Laya.Sprite();
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.addChild(this.panel);

        var dollar = new Laya.Sprite();
        dollar.loadImage("texture/game/dollar_0.png");
        dollar.pivot(dollar.width / 2, dollar.height / 2);
        dollar.pos(this.width / 2 + 25, this.height * 0.8 + 30);
        dollar.zOrder = 90;
        this.addChild(dollar);

        var dollar1 = new Laya.Sprite();
        dollar1.loadImage("texture/game/dollar_1.png");
        dollar1.pivot(dollar1.width / 2, dollar1.height / 2);
        dollar1.pos(this.width / 2, this.height * 0.8);
        dollar1.zOrder = 100;
        this.dollar = dollar1;
        this.addChild(dollar1);

        var belt = new Laya.Sprite();
        belt.loadImage("texture/game/belt.png");
        belt.pivot(belt.width / 2, belt.height / 2);
        belt.pos(this.width / 2 + 15, this.height * 0.85);
        belt.zOrder = 200;
        this.addChild(belt);

        this.dollarsArr = [];
        for (var i = 0; i < 2; ++i) {
            var dollars = new Dollars();
            dollars.pos(this.width * 0.25 + this.width * 0.25 * i * 2, this.height * 0.35);
            dollars.zOrder = 30;
            this.addChild(dollars);
            this.dollarsArr.push(dollars);
        }

        this.count = 0;
        this.bonusCount = 0;
        this.numArr = [0, 0];
        this.playDollars();

        this.displayHand();
    };

    __proto.handFunc = function (hand) {
        hand.graphics.clear();
        hand.graphics.loadImage("texture/game/hand_1.png");
        Laya.Tween.to(hand, { y: hand.y - 400 }, 1000, null, Laya.Handler.create(this, function () {
            hand.graphics.clear();
            hand.loadImage("texture/game/hand_0.png");
            hand.y += 400;
            hand.alpha = 1;
            Laya.timer.once(500, this, this.handFunc, [hand]);
        }));
        Laya.timer.once(750, this, function () {
            Laya.Tween.to(hand, { alpha: 0 }, 190);
        })
    };

    __proto.displayHand = function () {
        var hand = new Laya.Sprite();
        var hand1 = new Laya.Sprite();
        hand1.loadImage("texture/game/hand_0.png");
        hand1.pivot(hand1.width / 2, hand1.height / 2)
        hand.addChild(hand1);
        hand1.scale(1.3, 1.3);

        hand.pos(375, 800);
        hand.zOrder = 100;
        this.addChild(hand);
        hand.name = "handSp";
        Laya.timer.once(500, this, this.handFunc, [hand1]);

    };

    __proto.playDollars = function () {
        var updateDollars = function () {
            var x = Math.random() * 600 + 50;
            var d = Math.random() > 0.5 ? 1 : -1
            var dollar = new Laya.Sprite();
            dollar.loadImage("texture/game/dollar_5.png");
            dollar.pivot(dollar.width / 2, dollar.height / 2);
            dollar.pos(x, -100);
            dollar.scaleX = d;
            dollar.alpha = 0.7;
            dollar.rotation = Math.random() * 90;
            dollar.zOrder = 40;
            this.addChild(dollar);

            Laya.Tween.to(dollar, { y: this.height + 100, rotation: dollar.rotation + 60 * d }, 10000, null, Laya.Handler.create(this, function () {
                dollar.removeSelf();
                dollar.destroy();
            }));

            var t = Math.random() * 2000 + 500;
            Laya.timer.once(t, this, updateDollars);
        }.bind(this)

        updateDollars();
    };

    __proto.onMouseDown = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.hasTouched) return;

        var hand = this.getChildByName("handSp")
        if (hand != null) {
            hand.removeSelf();
            hand.destroy();
            Laya.timer.clear(this, this.handFunc)
        }
        this.hasTouched = true;
        this.beginPos = { x: x, y: y, dollarY: this.dollar.y };

    };


    __proto.onMouseMove = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.hasTouched == false) return;
        else if (this.beginPos == null) return;

        var vec = { row: 0, column: 0 };
        var angle = Utils.getS2TAngle({ x: x, y: y }, this.beginPos, 1);
        if (angle > 45 && angle <= 135) {
            vec = { row: -1, column: 0 };
            var o = y - this.beginPos.y;
            this.dollar.y = this.beginPos.dollarY + o;
            if (o > -100) return;
            this.playDollar();
            this.dollarsArr[0].addDollar(true);
            this.hasTouched = false;
            this.beginPos = null;
            this.numArr[0] += 100;
            this.headBar.setNum(0, this.numArr[0]);
            if (Global.robotType == 0) {
                var msg = {
                    type: "add",
                    num: this.numArr[0]
                }

                NetMgr.instance.send('msg', msg);
            }
            this.count++;
            if (this.count == 10) {
                this.showBonus();
            }

        }
        else if (angle > 135 && angle <= 225)
            vec = { row: 0, column: -1 };
        else if (angle > 225 && angle <= 315)
            vec = { row: 1, column: 0 };
        else if ((angle > 315 && angle <= 360) || (angle > 0 && angle <= 45))
            vec = { row: 0, column: 1 };

    };

    __proto.showBonus = function () {
        var bonus = this.bonusCount * 200000 + 200000;
        this.numArr[0] += bonus;
        this.headBar.setNum(0, this.numArr[0]);
        this.bonusCount++;
        this.count = 0;

        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_bonus.png");
        bg.size(bg.width, bg.height);
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);
        bg.zOrder = 99999;
        bg.scale(0.5, 0.5);

        var bounus = new Laya.Sprite();
        bounus.loadImage("texture/game/font/bonus.png");
        bounus.pivot(bounus.width / 2, bounus.height / 2);
        bounus.pos(bg.width * 0.2, bg.height / 2);
        bounus.scale(0.9, 0.9);
        bg.addChild(bounus);
        if (bonus < 1000000) bounus.x += 20;

        var txt = new Laya.Text();
        txt.text = "+" + bonus + "$";
        txt.width = 500;
        txt.fontSize = 50;
        txt.font = "sz3-laya";
        txt.wordWrap = true;
        txt.align = "left";
        txt.scale(0.9, 0.9);
        txt.pos(300, bg.height / 2 - 33);
        bg.addChild(txt);
        if (bonus < 1000000) txt.x += 20;

        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/award.mp3");

        Laya.Tween.to(bg, { scaleX: 1.2, scaleY: 1.2 }, 200, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(bg, { scaleX: 1, scaleY: 1 }, 200);
            Laya.timer.once(700, this, function () {
                bg.removeSelf();
                bg.destroy();
            })
        }.bind(this)))

        Laya.Tween.to(this.dollarsArr[0].panel, { scaleX: 1.3, scaleY: 1.3 }, 200, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.dollarsArr[0].panel, { scaleX: 1, scaleY: 1 }, 200)
        }.bind(this)))

    };

    __proto.onMouseUp = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        this.hasTouched = false;
        this.beginPos = null;
        this.dollar.pos(this.width / 2, this.height * 0.8);
    };

    __proto.playDollar = function () {
        this.dollar.zOrder = 101;
        var curDollar = this.dollar;
        Laya.Tween.to(this.dollar, { x: 200, y: -500, scaleX: 0.2, scaleY: 0.5 }, 250, null, Laya.Handler.create(this, function () {
            curDollar.removeSelf();
            curDollar.destroy();
        }.bind(this)));

        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/count_" + parseInt(Math.random() * 2) + ".mp3");

        var dollar = new Laya.Sprite();
        dollar.loadImage("texture/game/dollar_1.png");
        dollar.pivot(dollar.width / 2, dollar.height / 2);
        dollar.pos(this.width / 2, this.height * 0.8);
        dollar.zOrder = 100;
        this.dollar = dollar;
        this.addChild(dollar);
    };

    __proto.startGame = function (time) {
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        this.headBar.setHead();
        this.headBar.setMedal();

        Laya.timer.once(1500, this, function () {
            this.timeBar.startTimeDown();
            this.state = "running";
            if (Global.robotType == 1) this.updateRobot();
        }.bind(this));
    };

    __proto.updateRobot = function () {
        var count = 0;
        var bonusCount = 0;

        var addDollar = function () {
            if (this.state == "running") {
                this.numArr[1] += 100;
                count++;
                if (count == 10) {
                    var bonus = 200000 + 200000 * bonusCount;
                    this.numArr[1] += bonus;
                    bonusCount++;
                    count = 0;
                }

                this.headBar.setNum(1, this.numArr[1]);
                this.dollarsArr[1].addDollar(false);
                Laya.timer.once(300, this, addDollar);
            }
        }.bind(this)

        addDollar();
    }

    __proto.gameOver = function (result) {
        if (this.state == "over")
            return;

        this.state = "over";

        this.showLoading();
        Laya.timer.clearAll(this);
        Laya.timer.clearAll(this.timeBar);
        if (Global.testType == 0)
            this.showOver(result);
        else
            NetMgr.instance.send('gameover', { 'rst': result });
    };

    __proto.showOver = function (result, data) {
        var view = new OverView(result, data ? data : rstData);
        Laya.stage.addChild(view);
        for (var i = 0; i < this.listeneres.length; ++i)
            EventHelper.instance.off(this.listeneres[i].e, this, this.listeneres[i].h)
        this.removeSelf();
        this.destroy();
    };

     __proto.showLoading = function () {
        var loadBox = new Laya.Sprite();
        loadBox.loadImage("texture/game/loadBox.png");
        loadBox.pivot(loadBox.width / 2, loadBox.height / 2);
        loadBox.size(loadBox.width, loadBox.height);
        loadBox.pos(375, 640);
        loadBox.zOrder = 100;
        loadBox.name = "loadBox";
        this.addChild(loadBox);
        loadBox.scale(0.8, 0.8);

        var jh = new Laya.Sprite();
        jh.loadImage("texture/game/jh.png");
        jh.pivot(jh.width / 2, jh.height / 2);
        jh.pos(loadBox.width / 2, loadBox.height / 2 - 30);
        jh.scale(1.05, 1.05);
        loadBox.addChild(jh);

        var loading = new Laya.Sprite();
        loading.loadImage("texture/game/loading2.png");
        loading.pivot(loading.width / 2, loading.height / 2);
        loading.pos(loadBox.width / 2, loadBox.height / 2 + 40);
        loading.scale(1.25, 1.25);
        loadBox.addChild(loading);
        var loopFunc = function () {
            Laya.Tween.to(jh, { rotation: jh.rotation + 180 }, 700, null, Laya.Handler.create(this, loopFunc));
        }.bind(this)
        loopFunc();
    };
    
    return GameView;
}(Laya.View));