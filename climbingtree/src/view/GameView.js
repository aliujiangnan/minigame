/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.state = "idle";
        this.progressArr = [1, 1];
        this.isShowCloud = false;
        this.isMoving = false;
        this.isStart = false;

        this.size(Laya.stage.width, Laya.stage.height);
        this.initListeners();
        this.initView();
        this.initSelf();
    };

    var poleHeight = 267;
    var poleWidth = 57;
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
        exitBtn.zOrder = 300;
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
        mscBtn.zOrder = 300;
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
                case "climb":
                    this.oppMove(data.p, data.l, data.t)
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
        bg.size(bg.width, bg.height);
        bg.y = this.height - bg.height;
        this.addChild(bg);
        this.bg = bg;

        var sp = new Laya.Sprite();
        sp.size(this.width, this.height);
        sp.on(Laya.Event.MOUSE_DOWN, this, this.onClick);
        sp.zOrder = 200;
        this.addChild(sp);

        var view = new Laya.View();
        view.pivot(this.width / 2, 0);
        view.x = this.width / 2;
        view.scaleX = Global.scaleX;
        view.zOrder = 100;
        this.addChild(view);
        this.content = view;

        this.map = this.getMap();

        var progress = new Laya.Sprite();
        progress.loadImage("texture/game/progress.png");
        progress.pivot(progress.width / 2, progress.height / 2);
        progress.pos(this.width * 0.1, this.height * 0.3);
        progress.scale(Global.scaleY, Global.scaleX);
        progress.zOrder = 100;
        this.addChild(progress);

        var top = new Laya.Sprite();
        top.loadImage("texture/game/progress_top.png");
        top.pivot(top.width / 2, top.height / 2);
        top.pos(progress.width / 2, -top.height / 2);
        progress.addChild(top);

        var leftPro = new Laya.Sprite();
        leftPro.loadImage("texture/game/progress_2.png");
        leftPro.pivot(leftPro.width / 2, leftPro.height / 2);
        leftPro.pos(-leftPro.width / 2, 538 * (1 - 1 / Global.poleNum));
        progress.addChild(leftPro);
        this.leftPro = leftPro;

        var rightPro = new Laya.Sprite();
        rightPro.loadImage("texture/game/progress_3.png");
        rightPro.pivot(rightPro.width / 2, rightPro.height / 2);
        rightPro.pos(progress.width + rightPro.width / 2, 538 * (1 - 1 / Global.poleNum));
        progress.addChild(rightPro);
        this.rightPro = rightPro;

        var leftHead = new Laya.Sprite();
        leftHead.loadImage("texture/game/head_1.png");
        leftHead.scale(0.4, 0.4);
        leftHead.pos(1, 1);
        this.leftPro.addChild(leftHead);
        this.leftHead = leftHead;

        var rightHead = new Laya.Sprite();
        rightHead.loadImage("texture/game/head_1.png");
        rightHead.scale(0.4, 0.4);
        rightHead.pos(17, 1);
        this.rightPro.addChild(rightHead);
        this.rightHead = rightHead;
    };

    __proto.setProgress = function () {
        this.leftHead.loadImage(Global.userArray[0][3], 0, 0, this.leftHead.width * 0.9, this.leftHead.height * 0.9);
        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(0, 0, 45, "#ffffff");
        mask.pos(45, 45);
        this.leftHead.mask = mask;

        this.rightHead.loadImage(Global.userArray[1][3], 0, 0, this.rightHead.width * 0.9, this.rightHead.height * 0.9);
        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(0, 0, 45, "#ffffff");
        mask.pos(45, 45);
        this.rightHead.mask = mask;
    };

    __proto.getMap = function () {
        var map = [];
        for (var i = 0; i < Global.poleNum; i++) {
            var location = 0;
            var random = Utils.seededRandom();
            if (i == 0 || i == Global.poleNum - 1)
                location = 0;
            else if (random < 0.4)
                location = -1;
            else if (random > 0.6)
                location = 1;
            map[i] = location;
        }

        return map;
    }

    __proto.playCloud = function () {
        this.isShowCloud = true;
        this.updateCloud();
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

    __proto.initMap = function () {
        if (this.state == "running") return;
        for (var i = 0; i < this.map.length; i++) {
            var pole = new Laya.Sprite();
            pole.loadImage("texture/game/pole_0.png");
            pole.pivotY = pole.height / 2;
            pole.graphics.clear();
            this.content.addChild(pole);
            pole.y = Laya.stage.height - pole.height * (i + 1) + pole.height / 2;
            if (i == this.map.length - 1) {
                pole.loadImage("texture/game/pole_3.png");
                pole.pivot(pole.width / 2, pole.height / 4);
                var offsetY = poleHeight - pole.height
                pole.pos(Laya.stage.width / 2, Laya.stage.height - poleHeight * (i + 1) + pole.height / 2 + offsetY);

                var top = new Laya.Sprite();
                top.loadImage("texture/game/pole_top.png");
                top.pivot(top.width / 2, top.height / 2);
                top.pos(Laya.stage.width / 2, pole.y - poleHeight / 2 - top.height / 2 + offsetY);
                this.content.addChild(top);

                var banana = new Laya.Sprite();
                banana.loadImage("texture/game/banana.png");
                banana.pivot(banana.width / 2, banana.height / 2);
                banana.pos(Laya.stage.width / 2, top.y - banana.height / 2 - banana.height / 2);
                banana.zOrder = 1;
                this.content.addChild(banana);

                var light = new Laya.Sprite();
                light.loadImage("texture/game/light.png");
                light.pivot(light.width / 2, light.height / 2);
                light.pos(banana.x + 5, banana.y + 28);
                light.size(1.3, 1.3);
                this.content.addChild(light);

                var func = function () {
                    Laya.Tween.to(light, { rotation: light.rotation + 360 }, 10000);
                };
                func();
                Laya.timer.loop(60, this, func);
            }
            else if (this.map[i] == 0) {
                pole.loadImage("texture/game/pole_0.png");
                pole.pivotX = pole.width / 2;
                pole.x = Laya.stage.width / 2;
            }
            else if (this.map[i] == 1) {
                pole.loadImage("texture/game/pole_1.png");
                pole.pivotX = pole.width / 2;
                pole.x = Laya.stage.width / 2 + pole.width / 2 - 28.5;

            }
            else if (this.map[i] == -1) {
                pole.loadImage("texture/game/pole_2.png");
                pole.pivotX = pole.width / 2;
                pole.x = Laya.stage.width / 2 - pole.width / 2 + 28.8;
            }
            else {

            }
        }

        this.playerArr = [];
        this.locationArr = [];

        for (var i = 0; i < 2; i++) {
            this.playerArr[i] = new Player(i);
            this.playerArr[i].pos(Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[0].width / 2 + 13, Laya.stage.height - poleHeight - this.playerArr[0].height / 2 + 80);
            this.playerArr[i].scale(0.8, 0.8);
            this.content.addChild(this.playerArr[i]);
            this.locationArr[i] = -1;
            if (i == 1) {
                this.playerArr[i].x = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[0].width / 2 - 36.5 + 50;
                this.locationArr[i] = 1;
                this.playerArr[i].scaleX = -0.8;
            }
            if (i == Global.userColor) {
                this.playerArr[i].zOrder = 1;
                this.playerArr[i].displayUseful(-this.locationArr[i]);
            }
            else
                this.playerArr[i].y -= 10;
        }
    };
    __proto.displayTouch = function () {
        var left = new Laya.Sprite();
        left.loadImage("texture/game/left.png");
        left.pivot(left.width / 2, left.height / 2);
        left.pos(this.width / 2 - 200, this.height * 0.3);
        left.zOrder = 1000;
        left.name = "left";
        this.addChild(left);
        var func = function (left) {
            Laya.Tween.to(left, { scaleX: 1.05 * Global.scaleX, scaleY: 1.05 * Global.scaleY }, 200, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(left, { scaleX: 0.95 * Global.scaleX, scaleY: 0.95 * Global.scaleY }, 200)
            }));
        };
        func(left);
        Laya.timer.loop(400, this, func, [left]);

        var right = new Laya.Sprite();
        right.loadImage("texture/game/right.png");
        right.pivot(right.width / 2, right.height / 2);
        right.pos(this.width / 2 + 200, this.height * 0.3);
        right.zOrder = 1000;
        right.name = "right";
        this.addChild(right);

        var fn1 = function (right) {
            Laya.Tween.to(right, { scaleX: 0.95 * Global.scaleX, scaleY: 0.95 * Global.scaleY }, 200, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(right, { scaleX: 1.05 * Global.scaleX, scaleY: 1.05 * Global.scaleY }, 200)
            }));
        };
        fn1(right);
        Laya.timer.loop(400, this, fn1, [right]);
    };

    __proto.updateRobot = function () {
        this.updateProgress();
        Laya.timer.once(350, this, function () {
            if (this.state != "running")
                return;

            var location = this.map[this.progressArr[Global.opponentColor]] == 1 ? -1 : 1;
            this.oppMove(this.progressArr[Global.opponentColor], this.locationArr[Global.opponentColor], location);
            this.updateRobot();
        }.bind(this));
    };
    __proto.updateProgress = function () {
        this.leftPro.y = 538 * (1 - this.progressArr[Global.userColor] / Global.poleNum);
        this.rightPro.y = 538 * (1 - this.progressArr[Global.opponentColor] / Global.poleNum);
    };
    __proto.onClick = function (event) {
        if (this.getChildByName("left") != null) this.removeChildByName("left");
        if (this.getChildByName("right") != null) this.removeChildByName("right");
        if (!this.isStart)
            return;
        if (this.isMoving)
            return;
        if (this.state != "running")
            return;
        var location = 0;
        if (Laya.stage.mouseX > Laya.stage.width / 2 + poleWidth / 2) {
            location = 1;
            console.log("right");
        }
        else if (Laya.stage.mouseX < Laya.stage.width / 2 - poleWidth / 2) {
            location = -1;
            console.log("left");
        }
        else
            return;
        if (this.playerArr[Global.userColor].isDizzy)
            return;
        var result = -1;
        if (Global.robotType == 0) {
            var msg = {
                type: "climb",
                p: this.progressArr[Global.userColor],
                l: this.locationArr[Global.userColor],
                t: location
            }

            NetMgr.instance.send('msg', msg);
        }

        result = this.move(location, Global.userColor);

        if (result == 1) {
            this.gameOver();
        }

        this.updateProgress();
    };
    __proto.move = function (location, color) {
        if (this.map[this.progressArr[color]] != location) {
            this.locationArr[color] = location;
            var t = 100;
            if (this.locationArr[color] == -1) {
                this.playerArr[color].x = Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[color].width / 2 + 37 - 50;
                this.playerArr[color].scaleX = 0.8;
                this.playerArr[color].delta.scaleX = 1.6;
                this.playerArr[color].playAnim("jump", t);
                if (Global.isMusicOn && color == Global.userColor) {
                    Laya.SoundManager.stopAllSound();
                    Laya.SoundManager.playSound("sound/jump.wav");
                }
            }
            else if (this.locationArr[color] == 1) {
                this.playerArr[color].x = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[color].width / 2 - 36.5 + 50;
                this.playerArr[color].scaleX = -0.8;
                this.playerArr[color].delta.scaleX = -1.6;
                this.playerArr[color].playAnim("jump", t);
                if (Global.isMusicOn && color == Global.userColor) {
                    Laya.SoundManager.stopAllSound();
                    Laya.SoundManager.playSound("sound/jump.wav");
                }

            }

            var func = function () {
                this.isMoving = false;
            };
            if (color == Global.userColor && this.progressArr[color] <= 2) {
                this.isMoving = true;
                Laya.Tween.to(this.playerArr[color], { y: this.playerArr[color].y - poleHeight }, t, null, Laya.Handler.create(this, func));
            }
            else {
                var x = this.content.x;
                var y = this.content.y + poleHeight;
                if (color == Global.userColor) {
                    this.isMoving = true;
                    Laya.Tween.to(this.content, { x: x, y: y }, t);
                    if (this.bg.y > this.height - this.bg.height + 1311 && !this.isShowCloud)
                        this.playCloud();
                    Laya.Tween.to(this.bg, { y: this.bg.y + this.bg.height / (Global.poleNum * 1.5) }, t);
                }
                if (color == Global.userColor)
                    this.isMoving = true;
                Laya.Tween.to(this.playerArr[color], { y: this.playerArr[color].y - poleHeight }, t, null, Laya.Handler.create(this, func));
            }
            this.progressArr[color]++;
            if (this.progressArr[color] == Global.poleNum - 1) {
                return 1;
            }
        }
        else if (this.map[this.progressArr[color]] == location && location != this.locationArr[color]) {
            if (this.locationArr[color] == 1) {
                this.playerArr[color].x = Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[color].width / 2 + 37 - 50;
                this.playerArr[color].scaleX = 0.8;
                this.playerArr[color].delta.scaleX = 1.6;
                var posY = Laya.stage.height - poleHeight - this.playerArr[color].height / 2 + 80 - (this.progressArr[color] - 1) * poleHeight;
                this.playerArr[color].playDizzy(posY);
                var posX = Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[color].width / 2 + 40;
                this.playStar(posX, posY);
                if (Global.isMusicOn && color == Global.userColor) {
                    Laya.SoundManager.stopAllSound();
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
            }
            else if (this.locationArr[color] == -1) {
                this.playerArr[color].x = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[color].width / 2 - 36.5 + 50;
                this.playerArr[color].scaleX = -0.8;
                this.playerArr[color].delta.scaleX = -1.6;
                var posY = Laya.stage.height - poleHeight - this.playerArr[color].height / 2 + 80 - (this.progressArr[color] - 1) * poleHeight;
                this.playerArr[color].playDizzy(posY);
                var posX = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[color].width / 2 - 39.5;
                this.playStar(posX, posY);
                if (Global.isMusicOn && color == Global.userColor) {
                    Laya.SoundManager.stopAllSound();
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
            }
        }
        else {
            var posY = Laya.stage.height - poleHeight - this.playerArr[color].height / 2 + 80 - (this.progressArr[color] - 1) * poleHeight;
            this.playerArr[color].playDizzy(posY);
            var posX;
            if (this.locationArr[color] == -1)
                posX = Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[color].width / 2 + 40;
            else if (this.locationArr[color] == 1)
                posX = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[color].width / 2 - 39.5;
            this.playStar(posX, posY);
            if (Global.isMusicOn && color == Global.userColor) {
                Laya.SoundManager.stopAllSound();
                Laya.SoundManager.playSound("sound/hit.wav");
            }
        }
    };
    __proto.oppMove = function (progress, location, touch) {
        var posY = Laya.stage.height - poleHeight - this.playerArr[Global.opponentColor].height / 2 + 80 - (progress - 1) * poleHeight;
        var posX;
        if (this.locationArr[Global.opponentColor] == -1)
            posX = Laya.stage.width / 2 - poleWidth / 2 - this.playerArr[Global.opponentColor].width / 2 + 37 - 50;
        else if (this.locationArr[Global.opponentColor] == 1)
            posX = Laya.stage.width / 2 + poleWidth / 2 + this.playerArr[Global.opponentColor].width / 2 - 36.5 + 50;
        this.playerArr[Global.opponentColor].x = posX;
        this.playerArr[Global.opponentColor].y = posY;

        this.progressArr[Global.opponentColor] = progress;
        this.locationArr[Global.opponentColor] = location;

        var result = this.move(touch, Global.userColor == 0 ? 1 : 0);
        this.updateProgress();
        if (result == 1) {
            this.gameOver();
        }
    };

    __proto.playStar = function (posX, posY) {
        var part = new Laya.Particle2D(Global.setting);
        part.zOrder = 100;
        part.pos(posX, posY - 100);
        this.content.addChild(part);
        part.emitter.start();
        part.play();

        Laya.timer.once(880, this, function () {
            part.removeSelf();
        });
    }
    __proto.startGame = function () {
        var readyBar = new ReadyBar();
        readyBar.zOrder = 200;
        this.addChild(readyBar);

        Global.userColor = NetMgr.instance.seatIndex;
        Global.opponentColor = NetMgr.instance.getOpponent().index;
        
        this.initMap();
        this.state = "running";

        Laya.timer.once(2000, this, function () {

            this.isStart = true;
            this.displayTouch();
            if (Global.robotType == 1)
                this.updateRobot();
        }.bind(this));
    };

    __proto.gameOver = function () {
        if (this.state == "over")
            return;

        this.state = "over";
        var result = this.progressArr[Global.userColor] > this.progressArr[Global.opponentColor] ? 1 : 0;

        this.showLoading();
        Laya.timer.clearAll(this);
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
