/*
* GameView;
*/

var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.state = "idle";
        this.currentIndex = -1;
        this.targetIndex = -1;
        this.clearNum = 0;
        this.opponentNum = 0;
        this.frontNum = 0;
        this.size(Laya.stage.width, Laya.stage.height);
        this.initListeners();
        this.initView();
    }

    var maxRow = 6;
    var maxColumn = 4;
    var candySum = 8;
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

    Laya.class(GameView, "GameView", _super);

    var __proto = GameView.prototype;
    __proto.initView = function () {
        var exitBtn = new Laya.Button("texture/game/btn_exit.png");
        exitBtn.scale(Global.scaleX * 1.0, Global.scaleY * 1.0);
        exitBtn.pos(60, 60);
        exitBtn.anchorX = 0.5;
        exitBtn.anchorY = 0.5;
        exitBtn.stateNum = 3;
        exitBtn.zOrder = 200;
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
        mscBtn.zOrder = 200;
        mscBtn.name = "btn_msc";
        mscBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [mscBtn]);
        this.addChild(mscBtn);
        this.pressCount = 0;
        this.mscBtn = mscBtn;

        var ping = new Ping();
        ping.zOrder = 10;
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

        var addHandler = function (e, h) {
            this.listeneres.push({ e: e, h: h });
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("player_msg", function (data) {
            switch (data.type) {
                case "clear":
                    this.updateProgress(data.n)
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
        this.typeList = this.getTypeList();

        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_" + Global.srcType + ".png");
        this.addChild(bg);

        if (Global.srcType == 0) {
            this.playCloud();
            this.playFlower();
        }

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 200;
        this.addChild(headBar);
        this.headBar = headBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 200;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;
    };
    __proto.playFlower = function () {
        var posArr = [[57, 1230], [196, 1293], [349, 1308.5], [407, 1309], [668, 1309]];
        var pathArr = ["texture/game/sunflower_1.png", "texture/game/sunflower_1.png", "texture/game/sunflower_0.png", "texture/game/sunflower_1.png", "texture/game/sunflower_0.png",];
        var scaleArr = [0.4, 0.6, 0.8, 0.4, 0.6];
        var anchorArr = [[22, 88], [22, 88], [49, 88], [22, 88], [49, 88]];
        var timeArr = [1500, 2000, 1800, 2200, 1900];

        for (var i = 0; i < 5; i++) {
            var flower = new Laya.Sprite();
            flower.loadImage(pathArr[i]);
            flower.pivot(anchorArr[i][0], anchorArr[i][1]);
            flower.pos(posArr[i][0], posArr[i][1]);
            flower.scale(scaleArr[i], scaleArr[i]);
            this.addChild(flower);

            var func = function (flower, i) {
                Laya.Tween.to(flower, { rotation: -10 }, timeArr[i]);
            };
            Laya.Tween.to(flower, { rotation: 10 }, timeArr[i], null, Laya.Handler.create(this, func, [flower, i]));
            Laya.timer.loop(timeArr[i] * 2, this, function (flower, i) {
                Laya.Tween.to(flower, { rotation: 10 }, timeArr[i], null, Laya.Handler.create(this, func, [flower, i]));
            }, [flower, i]);
        }
    };

    __proto.playCloud = function () {
        var cloud = new Laya.Sprite();
        cloud.loadImage("texture/game/cloud.png");
        cloud.pos(0, cloud.height / 2);
        this.addChild(cloud);
        Laya.Tween.to(cloud, { x: -2 * this.width }, 30000 * 1.25);
        Laya.timer.once(30000 * 1.25, this, function () {
            cloud.removeSelf();
        })
        Laya.timer.once(15000 * 1.25, this, this.updateCloud);
    }

    __proto.updateCloud = function () {
        var cloud = new Laya.Sprite();
        cloud.loadImage("texture/game/cloud.png");
        cloud.pos(this.width, cloud.height / 2);
        this.addChild(cloud);
        Laya.Tween.to(cloud, { x: -2 * this.width }, 45000 * 1.25);
        Laya.timer.once(45000 * 1.25, this, function () {
            cloud.removeSelf();
        })
        Laya.timer.once(30000 * 1.25, this, this.updateCloud);
    };

    __proto.gameOver = function () {
        if (this.state == "over")
            return;

        this.state = "over";
        var result = this.clearNum > this.opponentNum ? 1 : 0;
        Laya.timer.once(500, this, function () {
            Laya.timer.clearAll(this.headBar);
        });

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

    __proto.startGame = function () {
        this.state = "running";

        var readyBar = new ReadyBar();
        readyBar.zOrder = 200;
        this.addChild(readyBar);

        this.initSelf();
        this.headBar.setHead();

        Laya.timer.once(2000, this, this.initCandies);

    };
    __proto.updateRobot = function () {
        var t = Math.floor(Utils.seededRandom() * 2000) + 4000;
        Laya.timer.once(t, this, function () {
            if (this.state == "idle" || this.state == "over" || this.state == Global.STOP) return;

            this.opponentNum += 2;
            this.headBar.addProgress(1, this.opponentNum);
            if (this.opponentNum == 24)
                return this.gameOver();
            this.updateRobot();
        });
    }

    __proto.updateProgress = function (num) {
        this.opponentNum = num;
        this.headBar.addProgress(1, num);
        if (this.opponentNum == 24) {
            Laya.timer.once(200, this, function () {
                this.gameOver();
            });
            return;
        }
    }

    __proto.initCandies = function () {
        if (this.state == "over") return;
        console.log("Game.initCandies()：" + "开始初始化");
        var sp = new Laya.Sprite();
        sp.size(this.width, this.height);
        sp.pivot(this.width / 2, this.height / 2);
        sp.pos(this.width / 2, this.height / 2 - 30);
        sp.scale(0.9 * Global.scaleX, 0.9 * Global.scaleY);
        sp.zOrder = 100;
        this.addChild(sp);

        this.candies = [];
        for (var row = 0; row < maxRow; row++) {
            for (var column = 0; column < maxColumn; column++) {
                var index = row * maxColumn + column;
                var candy = new Candy(this.typeList[index]);
                candy.pos(column * candy.width * 1.08 + 150, row * candy.height * 1.03 + 320);
                candy.name = "candy_" + index;
                candy.on(Laya.Event.MOUSE_DOWN, this, this.onClickCandy, [candy]);
                sp.addChild(candy);
                candy.appear();
                this.candies[index] = candy;
            }
        }
        console.log("Game.initCandies()：" + "初始化完毕");
    };

    __proto.onClickCandy = function (sender) {
        if (sender.name == "destroy" || this.frontNum > 2) return;
        if (this._state == "pause") return;
        switch (this.state) {
            case "running":
                {
                    this.currentIndex = parseInt(sender.name.slice(6, sender.name.length));
                    this.candies[this.currentIndex].setFront(0);
                    this.state = "first";
                    this.frontNum++;
                }
                break;
            case "first":
                {
                    this.targetIndex = parseInt(sender.name.slice(6, sender.name.length));
                    if (this.targetIndex == this.currentIndex) {

                    }
                    else {

                        this.state = "second";
                        var result = this.compare();
                        if (result == 0) {
                            this.frontNum++;
                            this.candies[this.targetIndex].setFront(1);
                            this.state = "idle";
                            var current = this.candies[this.currentIndex];
                            var target = this.candies[this.targetIndex];
                            current.name = "destroy";
                            target.name = "destroy";
                            Laya.timer.once(100, this, function () {
                                if (Global.isMusicOn) {
                                    Laya.SoundManager.playSound("sound/clear.mp3");
                                }
                                current.displayBroder(1);
                                target.displayBroder(1);
                                this.frontNum -= 2;

                                if (this.clearNum == maxRow * maxColumn) {
                                    this.gameOver();
                                }
                            });
                            this.candies[this.currentIndex] = null;
                            this.candies[this.targetIndex] = null;
                            this.currentIndex = -1;
                            this.targetIndex = -1;
                            this.state = "running";
                            this.clearNum += 2;
                            this.headBar.addProgress(0, this.clearNum);

                            if (Global.robotType == 0) {
                                var msg = {
                                    type: "clear",
                                    n: this.clearNum
                                }

                                NetMgr.instance.send('msg', msg);
                            }
                        }
                        else if (result == 1) {
                            this.candies[this.targetIndex].setFront(0);
                            this.frontNum++;
                        }
                    }
                }
                break;
            case "second":
                {
                    var i = parseInt(sender.name.slice(6, sender.name.length));
                    if (i == this.currentIndex) {
                        var t = this.candies[this.targetIndex].rollingTime;
                        var target = this.candies[this.targetIndex];
                        Laya.timer.once(t, this, function () {
                            target.setBack();
                            this.frontNum -= 1;
                        });
                        this.targetIndex = -1;
                        this.state = "first";
                    }
                    else if (i == this.targetIndex) {
                        var t = this.candies[this.currentIndex].rollingTime;
                        var target = this.candies[this.currentIndex];
                        Laya.timer.once(t, this, function () {
                            target.setBack();
                            this.frontNum -= 1;
                        });
                        this.currentIndex = this.targetIndex;
                        this.targetIndex = -1;
                        this.state = "first";
                    }
                    else {
                        var t1 = this.candies[this.currentIndex].rollingTime;
                        var current = this.candies[this.currentIndex];
                        var t2 = this.candies[this.targetIndex].rollingTime;
                        var t = t1 > t2 ? t1 : t2;
                        var target = this.candies[this.targetIndex];

                        Laya.timer.once(t, this, function () {
                            current.setBack();
                            target.setBack();
                            this.frontNum -= 2;
                        });

                        this.currentIndex = parseInt(sender.name.slice(6, sender.name.length));
                        this.targetIndex = -1;
                        this.candies[this.currentIndex].setFront(0);
                        this.state = "first";
                        this.frontNum++;
                    }
                }
                break;
        }
    };

    __proto.compare = function () {
        return this.candies[this.currentIndex].type == this.candies[this.targetIndex].type ? 0 : 1;
    };

    __proto.getTypeList = function () {
        var typeList = [];
        var typeNum = [[]];
        for (var i = 0; i < candySum; i++) {
            typeNum[i] = [];
        }
        for (var i = 0; i < maxColumn * maxRow; i++) {
            var type = parseInt((Utils.seededRandom() * candySum).toString()) + 1;
            typeList[i] = type;
            typeNum[type - 1][typeNum[type - 1].length] = i;
        }
        for (var i = 0; i < typeNum.length; i++) {
            if (typeNum[i].length % 2 != 0) {
                typeList[typeNum[i][typeNum[i].length - 1]] = 0;
            }
        }
        var type = parseInt((Utils.seededRandom() * candySum).toString()) + 1;
        for (var i = 0; i < typeList.length; i++) {
            if (typeList[i] == 0) {
                typeList[i] = type;
            }
        }
        return typeList;
    };

    return GameView;
}(Laya.View));
