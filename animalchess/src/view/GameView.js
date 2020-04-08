/*
 * GameView;
 */
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.state = "idle"
        this.lastIndex = -1;
        this.lastLocation = [];
        this.redNum = 8;
        this.buleNum = 8;
        this.roundNum = 0;
        this.isMoving = false;
        this.size(Laya.stage.width, Laya.stage.height);
        this.initListeners();
        this.initSelf();
        this.initView();
        this.hasBegin = false;
    };

    Laya.class(GameView, "GameView", _super);

    var RED = 0;
    var BULE = 1;
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
        this.muscBtn = mscBtn;

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

        var addHandler = function(e,h){
            this.listeneres.push({e:e,h:h});
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("player_msg", function (data) {
            switch (data.type) {
                case "select":
                    this.oppSelect(data.r, data.c, data.lr, data.lc,)
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
        this.addChild(bg);

        var panel = new Laya.Sprite();
        panel.size(this.width, this.height);
        panel.pivot(this.width / 2, this.height / 2);
        panel.pos(this.width / 2, this.height / 2 - 20);
        panel.scale(Global.scaleY, Global.scaleX);
        panel.zOrder = 10;
        this.addChild(panel);
        this.panel = panel;

        var road = new Laya.Sprite();
        road.loadImage("texture/game/lu.png");
        road.pivot(road.width / 2, road.height / 2);
        road.pos(this.panel.width / 2, this.panel.height / 2 + 71);
        this.panel.addChild(road);

        var timeBar = new TimeBar();
        timeBar.pos(this.width / 2, 140);
        timeBar.zOrder = 10;
        this.addChild(timeBar);
        this.timeBar = timeBar;

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 140);
        headBar.zOrder = 10;
        this.addChild(headBar);
        this.headBar = headBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 200;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;

        var order = new Laya.Sprite();
        order.loadImage("texture/game/order.png");
        order.scale(Global.scaleY, Global.scaleX);
        order.pivot(order.width / 2, 0);
        order.pos(this.width / 2, 210);
        this.addChild(order);
        this.array = this.getMap();

        var rule = new Laya.Sprite();
        rule.loadImage("texture/game/font/RULE.png");
        rule.pivot(rule.width / 2, 0);
        rule.pos(this.width / 2, 0);
        order.addChild(rule);

        var round = new Laya.Sprite();
        round.loadImage("texture/game/font/ROUND.png");
        round.pivot(round.width / 2, 0);
        round.pos(this.width / 2 - 25 - 25, 1100);
        this.panel.addChild(round);

        this.txtArr = [];
        this.txtArr1 = [];
        this.txtArr1[0] = [];
        this.txtArr1[1] = [];

        for (var i = 0; i < 10; i++) {
            var txt = new Laya.Sprite();
            txt.loadImage("texture/game/font/0" + i + ".png");
            txt.pivot(txt.width / 2, txt.height / 2);
            txt.pos(this.width / 2 + 115, 1128);
            txt.scale(1.2, 1.2);
            this.panel.addChild(txt);
            this.txtArr1[0].push(txt);
            txt.visible = false;
        }
        this.txtArr.push(this.txtArr1[0][0]);
        for (var i = 0; i < 10; i++) {
            var txt = new Laya.Sprite();
            txt.loadImage("texture/game/font/0" + i + ".png");
            txt.pivot(txt.width / 2, txt.height / 2);
            txt.pos(this.width / 2 + 163 - 25, 1128);
            txt.scale(1.2, 1.2);
            this.panel.addChild(txt);
            this.txtArr1[1].push(txt);
            txt.visible = false;
        }

        this.txtArr.push(this.txtArr1[1][0]);

        this.numArr = [0, -1];
        this.isPlayingRound = false;
        this.displayRound(1);

    };
    __proto.getMap = function () {
        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var map = [];
        for (var a = 0; a < 16; a++) {
            var i = parseInt("" + Utils.seededRandom() * array.length);
            map[map.length] = array[i];
            array[i] = -1;
            var ta = [];
            for (var j = 0; j < array.length; j++) {
                if (array[j] != -1)
                    ta[ta.length] = array[j];
            }
            array = ta;
        }
        return map;
    };

    __proto.initPanel = function () {
        this.typeList = [];
        for (var i = 0; i < Global.maxRow; i++) {
            this.typeList[i] = [];
            for (var j = 0; j < Global.maxColumn; j++) {
                this.typeList[i][j] = [];
                if (i < Global.maxRow && j < Global.maxColumn) {
                    var n = i * Global.maxColumn + j;
                    var type = this.array[n] > 7 ? this.array[n] - 8 : this.array[n];
                    var color = this.array[n] > 7 ? 0 : 1;
                    this.typeList[i][j][0] = type;
                    this.typeList[i][j][1] = color;
                    this.typeList[i][j][2] = 0;

                    var pawn = new Pawn(type, color);
                    pawn.pos(100 + j * 183, 463 + i * 183);
                    pawn.name = "pawn_" + n;
                    pawn.zOrder = 10 * (i + 1);
                    pawn.selfZOrder = 10 * (i + 1);
                    pawn.hiddenBorder();
                    this.panel.addChild(pawn);

                    var rect = new Laya.Sprite();
                    rect.size(pawn.width, pawn.height);
                    rect.pivot(pawn.width / 2, pawn.height / 2);
                    rect.pos(pawn.x, pawn.y);
                    rect.name = "rect_" + n;
                    this.panel.addChild(rect);
                    rect.on(Laya.Event.MOUSE_DOWN, this, this.onClickPawn, [i, j, n]);
                }
            }
        }
    };

    __proto.drawPanel = function () {
        for (var i = 0; i < Global.maxColumn + 1; i++) {
            this.graphics.drawLine(75 + i * 150, 367, 75 + i * 150, 967, "#ffffff", 2);
        }
        for (var i = 0; i < Global.maxRow + 1; i++) {
            this.graphics.drawLine(75, 367 + i * 150, 675, 367 + i * 150, "#ffffff", 2);
        }
    };

    __proto.playTimeDown = function (color, delay) {
        if (this.state == Global.OVER) return;

        this.timeBar.stopTimeDown();
        this.timeBar.startTimeDown(color);

        this.displayTurn(color);
    };

    __proto.displayRound = function (num) {
        if (this.isPlayingRound) return;
        this.isPlayingRound = true;
        var n = parseInt("" + num / 10);
        var m = num % 10;

        var func = function (txt, j, i) {
            Laya.Tween.to(txt, { scaleX: 0 }, 100, Laya.Ease.quintOut, Laya.Handler.create(this, function () {
                txt.visible = false;
                var txt1 = this.txtArr1[j][i];
                this.txtArr[j] = txt1;
                txt1.visible = true;
                Laya.Tween.to(txt1, { scaleX: 1.3 }, 100, Laya.Ease.quintIn, Laya.Handler.create(this, function () {
                    this.isPlayingRound = false;
                }));
            }.bind(this)));
        }.bind(this);

        if (num == 10) {
            for (var i = 0; i < 10; i++) {
                this.txtArr1[0][i].x -= 25;
            }
        }
        if (n == 0) {
            if (m != this.numArr[0]) {
                func(this.txtArr[0], 0, m);
            }
        }
        else {
            if (n != this.numArr[0]) {
                func(this.txtArr[0], 0, n);
            }
            if (m != this.numArr[1]) {
                func(this.txtArr[1], 1, m);
            }
        }
        if (num == 20) {
            var left = new Laya.Sprite();
            left.loadImage("texture/game/font/left.png");
            left.pivot(left.width / 2, left.height / 2);
            left.pos(this.width / 2, this.height / 2);
            left.zOrder = 300;
            this.panel.addChild(left);
            this.left = left;

            var txt = new Laya.Sprite();
            txt.loadImage("texture/game/font/l5.png");
            txt.pivot(txt.width / 2, 0);
            txt.pos(17, 7);
            left.addChild(txt);
            this.txtArr.push(txt);

            var gan = new Laya.Sprite();
            gan.loadImage("texture/game/font/!.png");
            gan.pivot(gan.width * 0.7, img.height * 0.8);
            gan.pos(188, 28);
            left.addChild(gan);

            var t = 200;
            var func = function (sp) {
                Laya.Tween.to(sp, { rotation: 0 }, t);
            };

            Laya.Tween.to(gan, { rotation: 20 }, t, null, Laya.Handler.create(this, func, [gan]));
            Laya.timer.loop(t * 2, this, function (sp, i) {
                Laya.Tween.to(sp, { rotation: 20 }, t, null, Laya.Handler.create(this, func, [sp]));
            }, [gan]);

            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/time.mp3");

            this.left.scale(0, 0);
            this.left.alpha = 0;
            Laya.Tween.to(this.left, { alpha: 1, scaleX: 2, scaleY: 2 }, 200, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(this.left, { scaleX: 1.8, scaleY: 1.8 }, 200);
            }.bind(this)))

            Laya.timer.once(1000, this, function () {
                Laya.Tween.to(this.left, { x: this.width / 2, y: 1170 + img.height / 2, scaleX: 1, scaleY: 1 }, 200);
            }.bind(this))
        }
        else if (num > 20) {
            this.txtArr[2].graphics.clear();
            this.txtArr[2].loadImage("texture/game/font/l" + (25 - num) + ".png");
        }

        this.numArr = [n, m];
    };

    __proto.displayTurn = function (type) {
        if (type === void 0) {
            type = 0;
        }
        if (type == 0)
            this.showUseful();

        this.headBar.playColor(type);
    };

    __proto.showUseful = function () {
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                var index = i * Global.maxColumn + j;
                if (this.typeList[i][j] != null && this.typeList[i][j][2] == 0) {
                    this.panel.getChildByName("pawn_" + index).displayBorder();
                } else if (this.typeList[i][j] != null && this.typeList[i][j][2] == 1 && this.typeList[i][j][1] == Global.userColor) {
                    var b = false;
                    b = true;
                    if (b) {
                        this.panel.getChildByName("pawn_" + index).displayBorder();
                    }
                }
            }
        }
    };

    __proto.hiddenBorder = function () {
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                var index = i * Global.maxColumn + j;
                if (this.typeList[i][j] != null)
                    this.panel.getChildByName("pawn_" + index).hiddenBorder();
            }
        }
    };

    __proto.displayUseful = function () {
        var row = parseInt("" + this.lastIndex / Global.maxColumn);
        var column = this.lastIndex % Global.maxColumn;

        var img = Laya.loader.getRes("texture/game/delta_0_green.png");
        var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
        var arr = [];
        if (row - 1 >= 0 && (this.typeList[row - 1][column] == null || (this.typeList[row - 1][column][2] == 1 && this.typeList[row - 1][column][1] == Global.opponentColor))) {
            pawn.displayUseful(0);
        }
        if (row + 1 < 4 && (this.typeList[row + 1][column] == null || (this.typeList[row + 1][column][2] == 1 && this.typeList[row + 1][column][1] == Global.opponentColor))) {
            pawn.displayUseful(1);
        }
        if (column - 1 >= 0 && (this.typeList[row][column - 1] == null || (this.typeList[row][column - 1][2] == 1 && this.typeList[row][column - 1][1] == Global.opponentColor))) {
            pawn.displayUseful(2);
        }
        if (column + 1 < 4 && (this.typeList[row][column + 1] == null || (this.typeList[row][column + 1][2] == 1 && this.typeList[row][column + 1][1] == Global.opponentColor))) {
            pawn.displayUseful(3);
        }
    };

    __proto.hiddenUseful = function () {
        this.panel.getChildByName("pawn_" + this.lastIndex).hiddenUseful();
    };

    __proto.onClickPawn = function (row, column, index) {
        if (!this.hasBegin) return;
        if (this.isMoving) return;

        var date = new Date();
        var time = date.getTime() - Global.timeOffset;
        if (Global.timeOffset == 0)
            time = 0;

        if (this.state == Global.userColor) {
            var result = this.onSelected(row, column, index);
            if (result == 0) {
                this.state = Global.opponentColor;
                this.typeList[row][column][2] = 1;
                Laya.timer.once(950, this, function () {
                    this.roundNum++;
                    if (this.roundNum >= Global.maxRound) {
                        this.autoOver();
                        return;
                    }
                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.playTimeDown(1, 0);
                });

                this.panel.getChildByName("pawn_" + index).setFront();
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/flip.wav");

                this.hiddenBorder();
                if (Global.robotType == 1) Laya.timer.once(3000, this, this.autoSelect);
                else {
                    var msg = {
                        type: "select",
                        c: column,
                        r: row,
                        lc: -1,
                        lr: -1,
                    }

                    NetMgr.instance.send('msg', msg);
                }
            }
            else if (result == 1) {
                this.state = Global.userColor + 4;
                this.lastIndex = index;
                this.lastLocation = [row, column];
                this.displayUseful();
                var pawn = this.panel.getChildByName("pawn_" + index);
                pawn.moveUp();
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/click.mp3");
                this.hiddenBorder();
            }
        }
        else if (this.state == Global.userColor + 4) {
            var lastRow = this.lastLocation[0];
            var lastColumn = this.lastLocation[1];
            var result = this.onMove(row, column, lastRow, lastColumn, index);
            if (result == 0) {
                this.hiddenUseful();
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn1.zOrder;
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");

                Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                    pawn.fallDown(true, true);
                    Laya.timer.once(550, this, function () {
                        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/eat.wav");
                        this.playShake();
                    }.bind(this));
                }.bind(this)));

                if (Global.robotType == 0) {
                    var msg = {
                        type: "select",
                        c: column,
                        r: row,
                        lc: lastColumn,
                        lr: lastRow,
                    }

                    NetMgr.instance.send('msg', msg);
                }

                this.isMoving = true;
                Laya.timer.once(750, this, function () {
                    this.panel.removeChildByName("pawn_" + index);
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = null;

                    this.isMoving = false;
                    this.roundNum++;

                    this.redNum--;
                    this.buleNum--;
                    if (this.roundNum >= Global.maxRound) {
                        Laya.timer.once(1000, this, this.autoOver);
                        return;
                    } else if (this.redNum == 0 && this.buleNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [2]);
                        return;
                    } else if (this.redNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [0]);
                        return;
                    } else if (this.buleNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [1]);
                        return;
                    }
                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.state = Global.opponentColor;
                    this.playTimeDown(1, 0);
                    if (Global.robotType == 1) Laya.timer.once(3000, this, this.autoSelect);

                }.bind(this));
            }
            else if (result == 1) {
                this.hiddenUseful();
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn1.zOrder;
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");

                Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                    pawn.fallDown(false, true);
                }));
                if (Global.robotType == 0) {
                    var msg = {
                        type: "select",
                        c: column,
                        r: row,
                        lc: lastColumn,
                        lr: lastRow,
                    }

                    NetMgr.instance.send('msg', msg);
                }
                this.isMoving = true;
                Laya.timer.once(750, this, function () {
                    this.typeList[lastRow][lastColumn] = null;
                    this.isMoving = false;
                    this.roundNum++;

                    this.redNum--;
                    if (this.roundNum >= Global.maxRound) {
                        Laya.timer.once(1000, this, this.autoOver);
                        return;
                    } else if (this.redNum == 0) {
                        this.gameOver(0);
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.state = Global.opponentColor;
                    this.playTimeDown(1, 0);
                    if (Global.robotType == 1) this.autoSelect();
                }.bind(this));
            }
            else if (result == 2) {
                this.hiddenUseful();
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn.zOrder;
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");

                Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                    pawn.fallDown(true, false);
                    pawn.zOrder = 10 * (row + 1);
                    pawn.selfZOrder = 10 * (row + 1);
                    Laya.timer.once(550, this, function () {
                        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/eat.wav");
                        this.playShake();
                    }.bind(this));
                }.bind(this)));
                if (Global.robotType == 0) {
                    var msg = {
                        type: "select",
                        c: column,
                        r: row,
                        lc: lastColumn,
                        lr: lastRow,
                    }

                    NetMgr.instance.send('msg', msg);
                }
                this.isMoving = true;
                Laya.timer.once(750, this, function () {
                    this.panel.removeChildByName("pawn_" + index);
                    pawn.name = "pawn_" + index;
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = [pawn.type, pawn.color, 1];
                    this.isMoving = false;
                    this.roundNum++;

                    this.buleNum--;
                    if (this.roundNum >= Global.maxRound) {
                        Laya.timer.once(1000, this, this.autoOver);
                        return;
                    } else if (this.buleNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [1]);
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.state = Global.opponentColor;
                    this.playTimeDown(1, 0);
                    if (Global.robotType == 1) Laya.timer.once(3000, this, this.autoSelect);
                }.bind(this));
            } else if (result == 3) {
                this.hiddenUseful();
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var x = 100 + column * 183;
                var y = 463 + row * 183;
                var z = pawn.zOrder;
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/move.mp3");
                Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                    pawn.moveDown();
                    pawn.zOrder = 10 * (row + 1);
                    pawn.selfZOrder = 10 * (row + 1);
                }.bind(this)));
                var n = row * Global.maxColumn + column;
                if (Global.robotType == 0) {
                    var msg = {
                        type: "select",
                        c: column,
                        r: row,
                        lc: lastColumn,
                        lr: lastRow,
                    }

                    NetMgr.instance.send('msg', msg);
                }
                this.isMoving = true;
                Laya.timer.once(750, this, function () {
                    pawn.name = "pawn_" + index;
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = [pawn.type, pawn.color, 1];
                    this.state = Global.opponentColor;

                    this.isMoving = false;
                    this.roundNum++;
                    if (this.roundNum >= Global.maxRound) {
                        this.autoOver();
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.playTimeDown(1, 0);
                    if (Global.robotType == 1) Laya.timer.once(3000, this, this.autoSelect);
                }.bind(this));
            } else if (result == -1) {
                this.state = Global.userColor;
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                pawn.moveDown();
                this.showUseful();
            } else if (result == -2) {
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                pawn.moveDown();
                if (pawn1 && pawn.color == pawn1.color && this.lastIndex != index) {
                    this.lastIndex = index;
                    this.lastLocation = [row, column];
                    pawn1.moveUp();
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/click.mp3");
                    this.displayUseful();
                    this.state = Global.userColor + 2;
                } else {
                    this.state = Global.userColor;
                    this.showUseful();
                }
            } else if (result == -3) {
                var pawn = this.panel.getChildByName("pawn_" + this.lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                pawn.moveDown();
                if (this.lastIndex != index) {
                    this.lastIndex = index;
                    this.lastLocation = [row, column];
                    pawn1.moveUp();
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/click.mp3");
                    this.state = Global.userColor + 2;
                    this.displayUseful();
                } else {
                    this.state = Global.userColor;
                    this.showUseful();
                }
            }
        }
    };

    __proto.playShake = function () {
        this.time = 0;
        this.selfX = this.x;
        this.selfY = this.y;
        var l = 20;
        var func = function () {
            this.time += 100 / 6;
            l -= 100 / 6 / 40;
            if (l < 0) {
                l = 0;
                Laya.timer.clear(this, func);
            }

            var offset = Math.sin(Math.PI * 2 * this.time / 360) * l;
            this.x = this.selfX + offset;
            this.y = this.selfY + offset;
        };
        Laya.timer.frameLoop(1, this, func);
    };

    __proto.displaySmoke = function (x, y) {
        var arr = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (var i = 0; i < 4; i++) {
            var smoke = new Laya.Sprite();
            smoke.loadImage("texture/game/smoke.png");
            smoke.pivot(smoke.width / 2, smoke.height / 2);
            smoke.pos(x - 35 * arr[i][0], y - 45 * arr[i][1]);
            smoke.zOrder = 9;
            smoke.rotation = i * 90;
            this.panel.addChild(smoke);
            Laya.Tween.to(smoke, { alpha: 0, x: x - 95 * arr[i][0], y: y - 105 * arr[i][1] }, 3000, Laya.Ease.strongOut, Laya.Handler.create(this, function () {
                smoke.removeSelf();
            }));
        }
    };

    __proto.autoOver = function () {
        var userMax = 0;
        var oppMax = 0;
        var userScore = 0;
        var oppScore = 0;

        var userHasMin = false;
        var opponentHasMin = false;

        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++)
                if (this.typeList[i][j] != null) {
                    if (this.typeList[i][j][1] == Global.userColor && this.typeList[i][j][0] == 0) {
                        userHasMin = true;
                    } else if (this.typeList[i][j][1] == Global.opponentColor && this.typeList[i][j][0] == 0) {
                        opponentHasMin = true;
                    }
                }
        }

        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++)
                if (this.typeList[i][j] != null) {
                    if (this.typeList[i][j][1] == Global.userColor) {
                        userMax = this.typeList[i][j][0] > userMax ? this.typeList[i][j][0] : userMax;
                        var score = this.typeList[i][j][0] + 1;
                        if (this.typeList[i][j][0] == 7 && opponentHasMin)
                            score = 1;
                        userScore += score;
                    } else if (this.typeList[i][j][1] == Global.opponentColor) {
                        oppMax = this.typeList[i][j][0] > oppMax ? this.typeList[i][j][0] : oppMax;
                        var score = this.typeList[i][j][0] + 1;
                        if (this.typeList[i][j][0] == 7 && userHasMin)
                            score = 1;
                        oppScore += score;
                    }
                }
        }
        if (userMax == oppMax) {
            var color = userScore > oppScore ? 0 : 1;
            if (userScore == oppScore)
                color = 2;
            this.gameOver(color == 1 ? 0 : 1);
        } else {
            var color = userMax > oppMax ? 0 : 1;
            this.gameOver(color == 1 ? 0 : 1);
        }
    };

    __proto.oppSelect = function (row, column, lastRow, lastColumn) {
        var index = row * Global.maxColumn + column;
        if (lastRow == -1 && lastColumn == -1) {
            this.onSelected(row, column, index);
            this.typeList[row][column][2] = 1;
            Laya.timer.once(950, this, function () {
                this.roundNum++;

                if (this.roundNum >= Global.maxRound) {
                    this.autoOver();
                    return;
                }

                if (this.roundNum % 2 == 0)
                    this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                this.state = Global.userColor;
                this.playTimeDown(0, 0);
            });

            this.panel.getChildByName("pawn_" + index).setFront();;
        }
        else if (lastRow != -1 && lastColumn != -1) {
            var lastIndex = lastRow * Global.maxColumn + lastColumn;
            var result = this.onMove(row, column, lastRow, lastColumn, index);
            this.panel.getChildByName("pawn_" + lastIndex).moveUp();
            if (result == 0) {
                var pawn = this.panel.getChildByName("pawn_" + lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn.zOrder;
                Laya.timer.once(350, this, function () {
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");
                    Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                        pawn.fallDown(true, true);
                        Laya.timer.once(550, this, function () {
                            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/eat.wav");
                            this.playShake();
                        }.bind(this));
                    }.bind(this)));
                })
                Laya.timer.once(1100, this, function () {
                    this.panel.removeChildByName("pawn_" + index);
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = null;
                    this.roundNum++;

                    this.redNum--;
                    this.buleNum--;

                    if (this.roundNum >= Global.maxRound) {
                        Laya.timer.once(1000, this, this.autoOver);
                        return;
                    } else if (this.redNum == 0 && this.buleNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [2]);
                        return;
                    } else if (this.redNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [0]);
                        return;
                    } else if (this.buleNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [1]);
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.state = Global.userColor;
                    this.playTimeDown(0, 0);
                }.bind(this));
            }
            else if (result == 1) {
                var pawn = this.panel.getChildByName("pawn_" + lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn1.zOrder;
                Laya.timer.once(350, this, function () {
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");
                    Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                        pawn.fallDown(false, true);
                    }));
                }.bind(this))

                Laya.timer.once(1100, this, function () {
                    this.typeList[lastRow][lastColumn] = null;
                    this.roundNum++;
                    this.buleNum--;

                    if (this.roundNum >= Global.maxRound) {
                        this.autoOver();
                        return;
                    } else if (this.buleNum == 0) {
                        this.gameOver(1);
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);
                    this.state = Global.userColor;
                    this.playTimeDown(0, 0,);
                }.bind(this));
            }
            else if (result == 2) {
                var pawn = this.panel.getChildByName("pawn_" + lastIndex);
                var pawn1 = this.panel.getChildByName("pawn_" + index);
                var x = pawn1.x - 0;
                var y = pawn1.y - 0;
                var z = pawn.zOrder;
                Laya.timer.once(350, this, function () {
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + pawn.type + ".wav");
                    Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                        pawn.fallDown(true, false);
                        pawn.zOrder = 10 * (row + 1);
                        pawn.selfZOrder = 10 * (row + 1);
                        Laya.timer.once(550, this, function () {
                            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/eat.wav");
                            this.playShake();
                        }.bind(this));
                    }));
                }.bind(this))
                Laya.timer.once(1100, this, function () {
                    this.panel.removeChildByName("pawn_" + index);
                    pawn.name = "pawn_" + index;
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = [pawn.type, pawn.color, 1];
                    this.roundNum++;
                    this.redNum--;

                    if (this.roundNum >= Global.maxRound) {
                        Laya.timer.once(1000, this, this.autoOver);
                        return;
                    }
                    if (this.redNum == 0) {
                        Laya.timer.once(1000, this, this.gameOver, [0]);
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);
                    this.state = Global.userColor;
                    this.playTimeDown(0, 0);
                }.bind(this));
            }
            else if (result == 3) {
                var pawn = this.panel.getChildByName("pawn_" + lastIndex);
                var x = 100 + column * 183 - 0;
                var y = 463 + row * 183 - 0;
                var z = pawn.zOrder;
                Laya.timer.once(350, this, function () {
                    Laya.Tween.to(pawn, { x: x, y: y }, 200, null, Laya.Handler.create(this, function () {
                        pawn.moveDown();
                        pawn.zOrder = 10 * (row + 1);
                        pawn.selfZOrder = 10 * (row + 1);
                    }));
                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/move.mp3");
                }.bind(this))
                var n = row * Global.maxColumn + column;
                Laya.timer.once(1100, this, function () {
                    pawn.name = "pawn_" + index;
                    this.typeList[lastRow][lastColumn] = null;
                    this.typeList[row][column] = [pawn.type, pawn.color, 1];
                    this.state = Global.userColor;
                    this.roundNum++;

                    if (this.roundNum >= Global.maxRound) {
                        this.autoOver();
                        return;
                    }

                    if (this.roundNum % 2 == 0)
                        this.displayRound(parseInt("" + this.roundNum / 2) + 1);

                    this.playTimeDown(0, 0);
                }.bind(this));
            }
        }
    };
    __proto.autoSelect = function () {
        var pos = this.getMoveArr();
        if (pos.length == 0)
            console.log("无可用位置");
        else
            this.oppSelect(pos[1][0], pos[1][1], pos[0][0], pos[0][1]);
    };
    __proto.getMoveArr = function () {
        var arr = [];
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                if (this.typeList[i][j] != null && this.typeList[i][j][2] == 1 && this.typeList[i][j][1] == Global.opponentColor) {
                    var arr4 = [
                        [-1],
                        [-1],
                        [-1],
                        [-1]
                    ];
                    if (i + 1 < Global.maxRow && this.typeList[i + 1][j] != null && this.typeList[i + 1][j][2] == 1)
                        arr4[0] = [this.onMove(i + 1, j, i, j), [i + 1, j]];
                    if (i - 1 >= 0 && this.typeList[i - 1][j] != null && this.typeList[i - 1][j][2] == 1)
                        arr4[1] = [this.onMove(i - 1, j, i, j), [i - 1, j]];
                    if (j + 1 < Global.maxColumn && this.typeList[i][j + 1] != null && this.typeList[i][j + 1][2] == 1)
                        arr4[2] = [this.onMove(i, j + 1, i, j), [i, j + 1]];
                    if (j - 1 >= 0 && this.typeList[i][j - 1] != null && this.typeList[i][j - 1][2] == 1)
                        arr4[3] = [this.onMove(i, j - 1, i, j), [i, j - 1]];

                    var func = function () {
                        var arr = [];
                        if (i + 1 < Global.maxRow && this.typeList[i + 1][j] == null)
                            arr = [i + 1, j];
                        else if (i - 1 >= 0 && this.typeList[i - 1][j] == null)
                            arr = [i - 1, j];
                        else if (j + 1 < Global.maxColumn && this.typeList[i][j + 1] == null)
                            arr = [i, j + 1];
                        else if (j - 1 >= 0 && this.typeList[i][j - 1] == null)
                            arr = [i, j - 1];
                        return arr;
                    }.bind(this);

                    var arr5 = func();
                    if (arr5.length > 0)
                        arr3[arr3.length] = [
                            [i, j], arr5
                        ];
                    for (var k = 0; k < 4; k++) {
                        if (arr4[k][0] == 0)
                            arr[arr.length] = [
                                [i, j], arr4[k][1]
                            ];
                        else if (arr4[k][0] == 1) {
                            if (arr5.length > 0)
                                arr2[arr2.length] = [this.typeList[i][j][0],
                                [i, j], arr5
                                ];
                        } else if (arr4[k][0] == 2)
                            arr1[arr1.length] = [this.typeList[arr4[k][1][0]][arr4[k][1][1]][0],
                            [i, j], arr4[k][1]
                            ];

                    }
                }
            }
        }

        var eatArr = this.getMaxEat(arr1);
        var eatenArr = this.getMaxEat(arr2);

        var posArr = [];
        if (eatArr[0] != -1) {
            if (eatenArr[0] != -1) {
                if (eatArr[0] >= eatenArr[0]) {
                    posArr = [eatArr[1], eatArr[2]];
                }
                else {
                    posArr = [eatenArr[1], eatenArr[2]];
                }

            }
            else {
                posArr = [eatArr[1], eatArr[2]];
            }
        }
        else if (eatenArr[0] != -1) {
            posArr = [eatenArr[1], eatenArr[2]];
        }

        if (posArr.length == 0 && arr.length > 0) {
            posArr = [arr[0][0], arr[0][1]];
        }

        if (posArr.length == 0) {
            var b = false;
            for (var i = 0; i < Global.maxRow; i++) {
                for (var j = 0; j < Global.maxColumn; j++) {
                    if (this.typeList[i][j] != null && this.typeList[i][j][2] == 0)
                        b = true;
                }
            }
            var pos = [];
            if (b) {
                pos = this.getRandPos();
                posArr = [
                    [-1, -1], pos
                ]
            } else if (arr3.length > 0) {
                var index = parseInt("" + Utils.seededRandom() * arr3.length);
                posArr = arr3[index];
            }
        }
        return posArr;
    };

    __proto.getMaxEat = function (arr, type) {
        var hasMax = false;
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++)
                if (this.typeList[i][j] != null && this.typeList[i][j][0] == 7)
                    hasMax = true;
        }
        var order = hasMax ? [6, 0, 1, 2, 3, 4, 5, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
        var arr1 = [-1];
        for (var j = 0; j < arr.length; j++) {
            arr1 = order[arr1[0]] > order[arr[j][0]] ? arr1 : arr[j];
        }

        return arr1;
    };

    __proto.getRandPos = function () {
        var row = parseInt((Utils.seededRandom() * Global.maxRow).toString());
        var column = parseInt((Utils.seededRandom() * Global.maxColumn).toString());
        if (!(this.typeList[row][column] != null && this.typeList[row][column][2] == 0))
            return this.getRandPos();
        return [row, column];
    }

    __proto.onSelected = function (row, column, index) {
        if (this.typeList[row][column] == null) {
            console.log("GameView.onSelect(): " + "所选区域棋子不存在");
            return -1;
        }
        var pawn = this.panel.getChildByName("pawn_" + index);
        if (this.typeList[row][column][2] == 0) {
            console.log("GameView.onSelect(): " + "反面");
        } else if (pawn.state == 1) {
            console.log("GameView.onSelect(): " + "正面");
            if ((this.typeList[row][column][1] == 0 && this.state == BULE) || (this.typeList[row][column][1] == 1 && this.state == RED)) {
                console.log("GameView.onSelect(): " + "所选棋子颜色与玩家所持颜色不同");
                return -1;
            }
            return 1;
        }
        return 0;
    };
    __proto.onMove = function (row, column, lastRow, lastColumn, index) {
        var pawn = this.panel.getChildByName("pawn_" + index);
        if (pawn != null && pawn.state == 0) {
            console.log("GameView.onSelect(): " + "所选棋子未翻开");
            return -1;
        }
        if (((lastRow == row + 1 || lastRow == row - 1) && lastColumn == column) || ((lastColumn == column + 1 || lastColumn == column - 1) && lastRow == row)) {
            if (this.typeList[row][column] == null) {
                console.log("GameView.onSelect(): " + "所选棋子不存在");
                return 3;
            } else if (this.typeList[row][column][1] == this.typeList[lastRow][lastColumn][1]) {
                console.log("Game.onSelect(): " + "所选棋子与上次所选的棋子颜色相同");
                return -3;
            } else if (this.typeList[row][column][0] == 7 && this.typeList[lastRow][lastColumn][0] == 0) {
                console.log("GameView.onSelect(): " + "所选棋子是大象,上次所选的棋子是老鼠");
                return 2;
            } else if (this.typeList[row][column][0] == 0 && this.typeList[lastRow][lastColumn][0] == 7) {
                console.log("GameView.onSelect(): " + "所选棋子是老鼠,上次所选的棋子是大象");
                return 1;
            } else if (this.typeList[row][column][0] == this.typeList[lastRow][lastColumn][0]) {
                console.log("GameView.onSelect(): " + "所选棋子与上次所选的棋子类型相同");
                return 0;
            } else if (this.typeList[row][column][0] > this.typeList[lastRow][lastColumn][0]) {
                console.log("GameView.onSelect(): " + "所选棋子大于上次所选的棋子");
                return 1;
            } else if (this.typeList[row][column][0] < this.typeList[lastRow][lastColumn][0]) {
                console.log("GameView.onSelect(): " + "所选棋子小于上次所选的棋子");
                return 2;
            }
        } else {
            console.log("GameView.onSelect(): " + "所选棋子与上次所选的棋子不相邻");
            return -2;
        }
    };
    __proto.startGame = function () {
        this.state = "running";

        var readyBar = new ReadyBar();
        readyBar.zOrder = 500;
        this.addChild(readyBar);

        Global.userColor = NetMgr.instance.seatIndex;
        Global.opponentColor = NetMgr.instance.getOpponent().index;
        Global.isFirst = Global.userColor == 0;

        this.headBar.setHead();
        this.headBar.setColor();
        this.headBar.setMedal();

        this.initPanel();

        this.state = Global.isFirst ? Global.userColor : Global.opponentColor;

        Laya.timer.once(2000, this, function () {
            this.hasBegin = true;
            if (Global.isFirst) {
                this.timeBar.startTimeDown(0);
                this.displayTurn();
            } else {
                this.timeBar.startTimeDown(1);
                this.displayTurn(1);
            }
        });
    };

    __proto.gameOver = function (result) {
        if (this.state == "over")
            return;
        this.timeBar.stopTimeDown(false);
        this.state = "over";
        this.showLoading();
        Laya.SoundManager.stopAll();
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