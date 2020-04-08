/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.state = "idle";
        this.cleanRowNum = 0;
        this.hasTouched = false;
        this.scores = [0, 0];
        this.addEnable = false;
        this.typeNum = 1;
        this.initListeners();
        this.initSelf();
        this.initView();
    }

    Laya.class(GameView, "GameView", _super);

    var moveTime = 10000;
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

        var addHandler = function (e, h) {
            this.listeneres.push({ e: e, h: h });
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("player_msg", function (data) {
            switch (data.type) {
                case "add":
                    this.addRow(1, data.add);
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
        bg.loadImage("texture/game/bg_1.png");
        bg.y = this.height - bg.height;
        this.addChild(bg);

        var line = new Laya.Sprite();
        line.loadImage("texture/game/line_0.png");
        line.pivot(line.width / 2, line.height / 2)
        line.pos(this.width / 2, this.height * 0.9);
        line.zOrder = 100;
        this.addChild(line);

        var line1 = new Laya.Sprite();
        line1.loadImage("texture/game/line_1.png");
        line1.pivot(line1.width / 2, line1.height / 2)
        line1.pos(this.width / 2, this.height * 0.9);
        line1.zOrder = 1000;
        this.addChild(line1);

        var mask = new Laya.Sprite();
        mask.loadImage("texture/game/mask.png");
        this.addChild(mask);
        mask.zOrder = 100;

    };

    __proto.displayHand = function () {
        var sp = new Laya.Sprite();
        img = Laya.loader.getRes("texture/game/hand_0.png");
        var hand = new Laya.Sprite();
        hand.graphics.drawTexture(img);
        hand.pivot(img.width / 2, img.height / 2)
        sp.addChild(hand);

        img = Laya.loader.getRes("texture/game/point.png");
        var point = new Laya.Sprite();
        point.graphics.drawTexture(img);
        point.pivot(img.width / 2, img.height / 2);
        point.pos(-50, -30);
        point.visible = false;
        sp.addChild(point);

        sp.pos(500, 500);
        sp.zOrder = 100;
        this.addChild(sp);

        var times = 0;
        var handFunc = function (hand, point) {
            times++;
            hand.graphics.clear();
            hand.graphics.loadImage("texture/game/hand_" + (times % 2) + ".png");

            if (times % 2 != 0)
                point.visible = true;
            else
                point.visible = false;
        };

        Laya.timer.loop(300, this, handFunc, [hand, point]);

    };

    __proto.initPanel = function () {
        var panel = new Laya.Sprite();
        panel.size(this.width, this.height);
        panel.pivot(this.width / 2, this.height / 2);
        panel.pos(this.width / 2, this.height / 2);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.addChild(panel);
        this.panel = panel;

        this.brickArr = [[], [], [], []];
        this.newBrickArr = [];
        var type = Utils.seededRandom(100, 0) < 10 ? 3 : 2;
        var rand = parseInt(Utils.seededRandom(4, 0));
        this.addCount = 0;
        for (var i = 0; i > -100; --i) {
            this.addBricks(i);
        }

        var light = new Laya.Sprite();
        light.loadImage("texture/game/guang.png");
        light.pivot(light.width / 2, light.height / 2);
        light.pos(this.width / 4 / 2 + 1 * this.width / 4, this.height / 2);
        light.name = "light";
        this.addChild(light);
        light.visible = false;

    };

    __proto.onMouseDown = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        var d2 = (x - this.exitBtn.x) * (x - this.exitBtn.x) + (y - this.exitBtn.y) * (y - this.exitBtn.y);
        if (d2 < 70 * 70) return;
        d2 = (x - this.mscBtn.x) * (x - this.mscBtn.x) + (y - this.mscBtn.y) * (y - this.mscBtn.y);
        if (d2 < 70 * 70) return;
        d2 = (x - this.mscBtn.x) * (x - this.mscBtn.x) + (y - this.mscBtn.y) * (y - this.mscBtn.y);
        if (d2 < 70 * 70) return;

        var index = parseInt(x / (this.width / 4));
        var light = this.getChildByName("light");
        light.x = this.width / 4 / 2 + index * this.width / 4;
        light.visible = true;

        this.hasTouched = true;

        this.onMouseUp(-1);
    };

    __proto.playAdd = function (type, num, y) {
        if (type == 0) {
            var opponent = new Laya.Sprite();
            opponent.loadImage("texture/game/opponent.png");
            opponent.pivot(opponent.width / 2, opponent.height / 2)
            opponent.pos(this.width / 2, y);
            opponent.zOrder = 1000;
            this.panel.addChild(opponent);

            var txt = new Laya.Text();
            txt.width = 300;
            txt.wordWrap = true;
            txt.text = "+" + num;
            txt.font = "num-laya";
            txt.leading = 5;
            txt.align = "center";
            txt.pos(-8, 200);
            opponent.addChild(txt);

            Laya.Tween.to(opponent, { y: opponent.y - 100, alpha: 0.5 }, 500, null, Laya.Handler.create(this.panel, function () {
                opponent.removeSelf();
                opponent.destroy();
            }));
        }
        else {
            var brick = new Laya.Sprite();
            brick.loadImage("texture/game/brick_2.png");
            brick.pivot(brick.width / 2, brick.height / 2)
            brick.pos(this.width * 0.9, this.height * 0.1);
            brick.zOrder = 1000;
            this.addChild(brick);

            var txt = new Laya.Text();
            txt.width = 300;
            txt.wordWrap = true;
            txt.text = "+" + num;
            txt.font = "num-laya";
            txt.leading = 5;
            txt.align = "center";
            txt.pos(-8, 0);
            brick.addChild(txt);
            brick.scale(0.7, 0.7);

            Laya.Tween.to(brick, { scaleX: 2, scaleY: 2 }, 100, null, Laya.Handler.create(this.panel, function (brick) {
                Laya.Tween.to(brick, { x: this.width * 0.05, y: this.height * 0.2, scaleX: 0.7, scaleY: 0.7 }, 300, null, Laya.Handler.create(this.panel, function () {
                    brick.removeSelf();
                    brick.destroy();
                }));
            }.bind(this), [brick]));
        }
    }

    __proto.addRow = function (index, num) {
        this.playAdd(1, num);
        Laya.Tween.to(this.panel, { y: this.panel.y + 85 * num * 0.66 }, 70);
        this.scores[index] += num;
    };

    __proto.updateRobot = function () {
        var t = Math.random() * 1500 + 700;
        var r = Math.random();
        var n = 4;

        if (r > 0.9)
            n = 1;
        else if (r > 0.6)
            n = 2;
        else if (r > 0.3)
            n = 3;

        this.addRow(1, n);

        Laya.timer.once(t, this, this.updateRobot);
    }

    __proto.onMouseMove = function () {

    };

    __proto.onMouseUp = function (index) {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        this.hasTouched = false;
        index = index != -1 ? index : parseInt(x / (this.width / 4));

        var isFour = function (indexRow, indexCol) {
            var n = 1;
            for (var i = 0; i < 4; ++i) {
                if (i != indexCol && this.brickArr[i][indexRow] != null)
                    n++;
            }

            if (n == 4) {
                var b = true;
                var type = 2;
                for (var i = 0; i < 4; ++i) {
                    if (this.brickArr[i].length != indexRow + 1)
                        b = false;
                    if (i != indexCol && type == 2 && this.brickArr[i][indexRow].type == 3)
                        type = 3;
                }

                if (type == 3) {
                    this.cleanRowNum += 0.5;
                    if (this.cleanRowNum != parseInt(this.cleanRowNum)) {
                        for (var j = 0; j < this.cleanRowNum; j++) {
                            for (var i = 0; i < 4; ++i) {
                                if (this.brickArr[i][indexRow] == null)
                                    continue;
                                if (i == indexCol) {
                                    this.playParticle(2, this.brickArr[indexCol][indexRow].x, this.brickArr[indexCol][indexRow].y);
                                    this.brickArr[i][indexRow].removeSelf();
                                    this.brickArr[i][indexRow].destroy();
                                    this.brickArr[i].splice(indexRow, 1);
                                }
                                else {
                                    this.brickArr[i][indexRow].break();

                                }
                            }
                        }
                    }
                }
                else {
                    ++this.cleanRowNum;

                }

                if (b && this.cleanRowNum == parseInt(this.cleanRowNum)) {
                    var index = Global.robotType == 1 ? 0 : NetMgr.instance.seatIndex;
                    if (this.addEnable) this.playAdd(0, this.cleanRowNum, this.brickArr[0][indexRow - 0].y);
                    for (var j = 0; j < this.cleanRowNum; j++) {
                        for (var i = 0; i < 4; ++i) {
                            this.playParticle(this.brickArr[i][indexRow - j].type, this.brickArr[i][indexRow - j].x, this.brickArr[i][indexRow - j].y);

                            this.brickArr[i][indexRow - j].removeSelf();
                            this.brickArr[i][indexRow - j].destroy();
                            this.brickArr[i].splice(indexRow - j, 1);
                        }
                        this.scores[index]++;
                    }
                    if (Global.robotType == 0 && this.addEnable) {
                        var msg = { type: "add", add: this.cleanRowNum };
                        NetMgr.instance.send('msg', msg);
                    }

                    this.cleanRowNum = 0;
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/clear.mp3");
                }
                else if (Global.isMusicOn) Laya.SoundManager.playSound("sound/failed.mp3");
            }
            else
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/failed.mp3");
        }.bind(this)

        var getLastExistBrick = function (index) {
            for (var i = this.brickArr[index].length; i >= 0; --i) {
                if (this.brickArr[index][i] != null)
                    return this.brickArr[index][i];
            }

            return null;
        }.bind(this);

        var lastExist = getLastExistBrick(index);
        if (lastExist == null) {
            console.log("last is not exist!");
            return;
        }

        var type = 2;
        var brick = new Brick(type);
        brick.pos(this.width / 4 / 2 + index * this.width / 4, this.height * 0.9 - brick.height / 2 + (this.height / 2 - this.panel.y));
        brick.zOrder = lastExist.zOrder + 1;
        this.panel.addChild(brick);
        brick.showTrailing();

        this.newBrickArr.push(Brick);
        var speed = 5000;
        var moveUp = function () {
            lastExist = getLastExistBrick(index);

            brick.pos(this.width / 4 / 2 + index * this.width / 4, lastExist.y + 80);
            brick.hiddenTrailing();
            Laya.Tween.to(brick, { y: this.height * 0.9 - brick.height / 2 }, (this.height * 0.9 - brick.height / 2 - brick.y) / (this.height * 0.9) * moveTime);
            Laya.timer.clear(this, moveUp);
            lastIndex = this.brickArr[index].indexOf(lastExist);
            if (lastIndex == this.brickArr[index].length - 1)
                this.brickArr[index].push(brick);
            else
                this.brickArr[index][lastIndex + 1] = brick;

            if (isFour(this.brickArr[index].indexOf(lastExist) + 1, index))
                console.log("is four!!!");
        }.bind(this)

        var func = function () {
            brick.y -= 120
            if (brick.y - lastExist.y < 120) {
                moveUp();
                Laya.timer.clear(this, func)
            }
        }.bind(this)
        Laya.timer.frameLoop(1, this, func);
    };

    __proto.playParticle = function (type, x, y) {
        var anim = new Laya.Animation();
        anim.play(0, false, "explode_" + type);
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(x, y);
        anim.on(Laya.Event.COMPLETE, this.panel, function () {
            anim.removeSelf();
            anim.destroy();
        })
        anim.zOrder = 1000;
        this.panel.addChild(anim);
    };

    __proto.startGame = function () {
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        Laya.timer.once(1500, this, function () {
            this.initPanel();
            this.updateBrick();
            Laya.timer.once(3000, this, function () {
                if (this.state == "over") return;
                this.addEnable = true;
                if (Global.robotType == 1) {
                    this.updateRobot();
                    Laya.timer.once(15000 + Math.random() * 15000, this, this.gameOver, [0]);
                }
            })
            Laya.timer.once(10000, this, function () {
                this.typeNum = 2;
            })
            this.state = "running";
        }.bind(this));
    };

    __proto.clearTween = function () {
        if (this.panel) Laya.Tween.clearAll(this.panel);
        for (var i = 0; i < this.brickArr.length; ++i) {
            for (var j = this.brickArr[i].length - 1; j >= 0; --j) {
                if (this.brickArr[i][j] != null) {
                    Laya.Tween.clearAll(this.brickArr[i][j]);
                }
            }
        }
        for (var i = 0; i < this.newBrickArr.length; ++i)
            Laya.Tween.clearAll(this.newBrickArr[i]);
    }

    __proto.moveDown = function () {
        for (var i = 0; i < this.brickArr.length; ++i) {
            for (var j = this.brickArr[i].length - 1; j >= 0; --j) {
                if (this.brickArr[i][j] != null) {
                    if (this.brickArr[i][j].y >= this.height * 0.9 - (this.brickArr[i][j].height / 2 + this.panel.y - this.panel.height / 2)) {
                        Laya.timer.clear(this, this.moveDown);
                        Laya.timer.clear(this, this.addBricks);
                        this.clearTween();
                        return this.gameOver(0);
                    }
                }
            }
        }
    }

    __proto.updateBrick = function () {
        var speed = 100;

        Laya.timer.frameLoop(1, this, this.moveDown);
        this.addBricks(-1000);
        Laya.timer.loop(80 / (this.height * 0.9 / moveTime), this, this.addBricks, [-1000]);
    };

    __proto.addBricks = function (index) {
        var type = (Utils.seededRandom(100, 0) < 10) ? 3 : 2;
        if (this.brickArr[0].length < 10) type = 2;

        var rand = parseInt(Utils.seededRandom(4, 0));
        for (var i = 0; i < 4; ++i) {
            if (rand != i) {
                var brick = new Brick(type);
                brick.pos(this.width / 4 / 2 + i * this.width / 4, 80 * index - brick.height / 2);
                this.panel.addChild(brick);
                brick.zOrder = 1000 - this.addCount;
                this.brickArr[i].splice(0, 0, brick);
                Laya.Tween.to(brick, { y: this.height * 0.9 - brick.height / 2 }, (this.height * 0.9 - brick.height / 2 - brick.y) / (this.height * 0.9) * moveTime);
            }
            else {
                this.brickArr[i].splice(0, 0, null);
            }
        }
        this.addCount++;
    };

    __proto.gameOver = function (result) {
        if (this.state == "over") return;
        this.state = "over";

        Laya.timer.clear(this, this.updateRobot);
        Laya.timer.clear(this, this.moveDown);
        Laya.timer.clear(this, this.addBricks);
        Laya.timer.clearAll(this);
        this.clearTween();
        Laya.SoundManager.stopAll();

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