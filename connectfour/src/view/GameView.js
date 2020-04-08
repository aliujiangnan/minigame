/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.state = "idle";
        this.isMouseDown = false;
        this.size(Laya.stage.width, Laya.stage.height);
        this.num = 0;
        this.initListeners();
        this.initSelf();
        this.initView();
    };

    Laya.class(GameView, "GameView", _super);

    var black = 0;
    var white = 1;
    var rectWidth = 102;
    var rectHeight = 100.8;
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
                case "select":
                    this.onSelected(data.r, data.c, NetMgr.instance.getOpponent().index)
                    this.playTimeDown(0);
                    this.displayTurn(0);
                    this.state = Global.userColor;
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
        bg.name = "bg";
        this.addChild(bg);

        var panel = new Laya.Sprite();
        panel.loadImage("texture/game/panel_0.png");
        panel.pivot(panel.width / 2, panel.height / 2);
        panel.pos(this.width / 2, this.height / 2);
        panel.scale(Global.scaleX, Global.scaleY);
        this.addChild(panel);
        this.panel = panel;

        var panel1 = new Laya.Sprite();
        panel1.loadImage("texture/game/panel_1.png");
        panel1.pivot(panel1.width / 2, panel1.height / 2);
        panel1.pos(this.width / 2, this.height / 2);
        panel1.scale(Global.scaleX, Global.scaleY);
        panel1.zOrder = 10;
        this.addChild(panel1);
        this.panel1 = panel1;

        var sp = new Laya.Sprite();
        sp.size(this.width, panel1.height);
        sp.pivot(panel1.width / 2, panel1.height / 2);
        sp.pos(this.width / 2, this.height / 2);
        sp.scale(Global.scaleY, Global.scaleX);
        sp.zOrder = 20;
        this.addChild(sp);
        sp.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        sp.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        sp.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        sp.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        this.container = sp;

        this.typeList = [];
        for (var i = 0; i < Global.maxRow + 6; i++) {
            this.typeList[i] = [];
            for (var j = 0; j < Global.maxColumn + 6; j++) {
                this.typeList[i][j] = -1;
                if (i < Global.maxRow && j < Global.maxColumn) {
                    var rect = new Laya.Sprite();
                    rect.size(rectWidth, rectWidth);
                    rect.pivot(rectWidth / 2, rectHeight / 2);
                    rect.pos(rectWidth * (j + 1) - 32, rectHeight * (i + 1) + 399);
                    var n = i * Global.maxColumn + j;
                    rect.name = "rect_" + n;

                    this.panel1.addChild(rect);
                }
            }
        }

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 10;
        this.addChild(headBar);
        this.headBar = headBar;

        var timeBar = new TimeBar();
        timeBar.pos(this.width / 2, 180);
        timeBar.zOrder = 10;
        this.addChild(timeBar);
        this.timeBar = timeBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 200;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;
    };

    __proto.displayUseful = function () {
        var locations = this.getUseful();
        for (var i = 0; i < locations.length; i++) {
            var n = locations[i][0] * Global.maxColumn + locations[i][1];
            var rect = this.panel1.getChildByName("rect_" + n);
            rect.graphics.clear();
            rect.removeChildByName("delta");
            var img = Laya.loader.getRes("texture/game/delta_2.png");
            var delta = new Laya.Sprite();
            delta.loadImage("texture/game/delta_2.png", 48, 58);
            delta.name = "delta";
            delta.pivot(img.width / 2, img.height / 2);

            var y = -10;
            var y1 = 10;
            Laya.Tween.to(delta, { x: 0, y: y1 }, 500);
            Laya.timer.once(500, delta, function (delta) {
                Laya.Tween.to(delta, { x: 0, y: 0 }, 500);
            }, [delta]);

            Laya.timer.loop(1000, delta, function (delta) {
                Laya.Tween.to(delta, { x: 0, y: y1 }, 500);
                Laya.timer.once(500, delta, function () {
                    Laya.Tween.to(delta, { x: 0, y: 0 }, 500);
                });
            }, [delta]);

            rect.addChild(delta);
        }
    };
    __proto.getUseful = function () {
        var locations = [];
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                if (i == Global.maxRow - 1 && this.typeList[i + 3][j + 3] == -1) {
                    locations[locations.length] = [i, j];
                }
                else if (i > 0 && this.typeList[i + 3][j + 3] != -1 && this.typeList[i - 1 + 3][j + 3] == -1) {
                    locations[locations.length] = [i - 1, j];
                }
            }
        }
        return locations;
    }
    __proto.hiddenUseful = function () {
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                var n = i * Global.maxColumn + j;
                var rect = this.panel1.getChildByName("rect_" + n);
                rect.graphics.clear();
                rect.removeChildByName("delta");
            }
        }
    };
    var onTimer = function () {
        this.touchTime += 10;
    };
    __proto.onMouseDown = function () {
        var c = Global.userColor;
        if (this.state == Global.userColor && this.isMouseDown == false) {
            this.touchTime = 0;
            Laya.timer.clear(this, onTimer);
            Laya.timer.loop(10, this, onTimer);

            var x = (Laya.stage.mouseX - (Laya.stage.width - Laya.stage.width * Global.scaleX) / 2) / Global.scaleX;
            var y = Laya.stage.mouseY;
            if (x < 68) x = 68;
            else if (x > this.width - 72) x = this.width - 72;
            var sp = this.container;
            if (y < sp.y - sp.height * sp.scaleY * 0.24 || y > sp.y + sp.height * sp.scaleY * 0.35)
                return;

            this.hiddenUseful();
            var column = parseInt("" + (x - 17) / rectWidth);
            for (var i = 0; i < Global.maxRow; i++) {
                var n = i * Global.maxColumn + column;
                var rect = this.panel1.getChildByName("rect_" + n);
                if (this.typeList[i + 3][column + 3] == -1) {
                    rect.graphics.clear();
                    rect.loadImage("texture/game/pawn_" + Global.userColor + "_gray.png", 10, 15);
                }
            }
            if (this.panel.getChildByName("newPawn")) {
                this.panel.removeChildByName("newPawn");
            }

            var pawn = new Pawn(Global.userColor);
            pawn.pos(x, 380);
            pawn.name = "newPawn";
            this.panel.addChild(pawn);
            this.isMouseDown = true;
        }
    };
    __proto.onMouseOut = function () {
        if (this.isMouseDown == true && this.state == Global.userColor) {
            this.panel.removeChildByName("newPawn");
            for (var i = 0; i < Global.maxRow; i++) {
                for (var j = 0; j < Global.maxColumn; j++) {
                    var n = i * Global.maxColumn + j;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                }
            }
            this.displayUseful();
            this.isMouseDown = false;
        }
    };

    __proto.onMouseMove = function () {
        if (this.isMouseDown == true && this.state == Global.userColor) {
            var x = (Laya.stage.mouseX - (Laya.stage.width - Laya.stage.width * Global.scaleX) / 2) / Global.scaleX;
            var y = Laya.stage.mouseY;

            if (x < 14 || x > this.width - 14 || y < 318 || y > 1176) {
                Laya.timer.clear(this, onTimer);
                this.panel.removeChildByName("newPawn");
                var column = parseInt("" + (x - 17) / rectWidth);

                if (x < 15) column = 0
                else if (x > this.width - 15) column = 6
                for (var i = 0; i < Global.maxRow; i++) {
                    for (var j = 0; j < Global.maxColumn; j++) {
                        var n = i * Global.maxColumn + j;
                        var rect = this.panel1.getChildByName("rect_" + n);
                        rect.graphics.clear();
                    }
                }

                this.displayUseful();
                this.isMouseDown = false;
                return;
            }
            else if (x < 68) x = 68;
            else if (x > this.width - 72) x = this.width - 72;

            var column = parseInt("" + (x - 17) / rectWidth);
            for (var i = 0; i < Global.maxRow; i++) {
                for (var j = 0; j < Global.maxColumn; j++) {
                    var n = i * Global.maxColumn + j;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    if (column == j && this.typeList[i + 3][j + 3] == -1) {
                        rect.graphics.clear();
                        rect.loadImage("texture/game/pawn_" + Global.userColor + "_gray.png", 10, 15);
                    }
                    else {
                        rect.graphics.clear();
                    }
                }
            }

            var pawn = this.panel.getChildByName("newPawn");
            pawn.x = x;
        }
    };
    __proto.onMouseUp = function () {
        if (this.isMouseDown == true && this.state == Global.userColor) {
            Laya.timer.clear(this, onTimer);
            this.isMouseDown = false;
            var x = (Laya.stage.mouseX - (Laya.stage.width - Laya.stage.width * Global.scaleX) / 2) / Global.scaleX;
            if (x < 68) x = 68;
            else if (x > this.width - 68) x = this.width - 68;

            var column = parseInt("" + (x - 17) / rectWidth);
            for (var i = 0; i < Global.maxRow; i++) {
                for (var j = 0; j < Global.maxColumn; j++) {
                    var n = i * Global.maxColumn + j;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                }
            }

            this.panel.removeChildByName("newPawn");
            var depth = this.getDepth(column);
            var row = depth - 1;
            if (depth == 0) {
                return;
            }
            else if (this.typeList[row + 3][column + 3] != -1) {
                return;
            }

            this.state = Global.userColor == black ? white : black;
            if (Global.robotType == 0) {
                var msg = {
                    type: "select",
                    r: row,
                    c: column,
                    t: Date.now() - Global.timeOffset,
                }

                NetMgr.instance.send('msg', msg);
            }

            var result = this.onSelected(row, column, Global.userColor);
            if (result == 0) {
                this.playTimeDown(1);
                Laya.timer.once(depth * 175, this, function () {
                    if (this.state == Global.opponentColor)
                        this.displayTurn(1);
                });
                if (Global.robotType == 1) {
                    var delay = parseInt((Math.random() * 3).toString()) * 1000 + 2000;
                    Laya.timer.once(depth * 175 + delay, this, function () {
                        this.autoSelect();
                    });
                }
            }
        }
    };

    __proto.playTimeDown = function (color) {
        this.timeBar.stopTimeDown(true);
        this.timeBar.startTimeDown(color, 0);

        if (color == 0) {
            this.displayUseful();
        }
    };

    __proto.getDepth = function (column) {
        for (var i = Global.maxRow + 2; i > 2; i--) {
            if (this.typeList[i][column + 3] == -1)
                return i - 2;
        }
        return 0;
    };

    __proto.autoSelect = function () {
        var locations = this.getUseful();
        var robotMax = this.getMaxLine(Global.userColor == 0 ? 1 : 0, locations);
        var playerMax = this.getMaxLine(Global.userColor, locations);
        var index = robotMax[0] >= playerMax[0] ? robotMax[1] : playerMax[1];
        var result = this.onSelected(locations[index][0], locations[index][1], Global.userColor == 0 ? 1 : 0);

        Laya.timer.once((locations[index][0] + 1) * 175, this, function () {
            if (this.state == "over") return;
            this.state = Global.userColor;
            if (result == 0) {
                this.playTimeDown(0);
                this.displayTurn(0);
            }
        });
    };

    __proto.onSelected = function (row, column, color) {
        img = Laya.loader.getRes("texture/game/pawn_0.png");
        var pawn = new Pawn(color);
        pawn.pivot(img.width / 2, img.height / 2);
        pawn.pos(rectWidth * (column + 1) - 34, 380);
        var x = pawn.x;
        var y = rectHeight * (row + 1) + 403.5;
        this.panel.addChild(pawn);
        pawn.name = "pawn_" + (row * Global.maxColumn + column);
        this.typeList[row + 3][column + 3] = color;
        var n = this.getLine(row + 3, column + 3, color, true);
        this.num++;

        if (n < 4) {
            if (Global.isMusicOn) {
                Laya.SoundManager.playSound("sound/fall.mp3");
            }
            Laya.Tween.to(pawn, { x: x, y: y }, (row + 1) * 175, Laya.Ease.bounceOut);
            if (this.num == 42)
                this.gameOver(2, (row + 1) * 175 + 2000);
            return 0;
        }
        else {
            if (Global.isMusicOn) {
                Laya.timer.once((row + 1) * 50, this, function () {
                    Laya.SoundManager.playSound("sound/win.mp3");
                });
            }
            Laya.Tween.to(pawn, { x: x, y: y }, (row + 1) * 50, Laya.Ease.strongOut(0, 5));
            this.gameOver(color == Global.userColor ? 1 : 0, (row + 1) * 50 + n * 100 + 2000);
            return 1;
        }
    };

    __proto.startGame = function () {
        this.state = "running";
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        Global.userColor = NetMgr.instance.seatIndex;
        Global.opponentColor = NetMgr.instance.getOpponent().index;

        this.headBar.setHead();
        this.headBar.setColor();
        this.headBar.setMedal();

        console.log("userColor", Global.userColor, "opColor", Global.opponentColor);
        Laya.timer.once(2000, this, function () {
            this.timeBar.stopTimeDown(true);
            this.timeBar.startTimeDown(Global.userColor == Global.firstColor ? 0 : 1);
            this.state = Global.firstColor;
            if (Global.userColor == Global.firstColor) {
                this.displayUseful();
                this.displayTurn(0);
            }
            else
                this.displayTurn(1);
        });
    };

    __proto.displayTurn = function (type) {
        var str = "texture/game/txt_your.png";
        if (type == 1) str = "texture/game/txt_opponets.png";
        this.removeChildByName("txt_turn");
        var txt = new Laya.Sprite();
        txt.loadImage(str);
        txt.pivot(txt.width / 2, txt.height / 2);
        txt.pos(this.width / 2, this.height * 0.25 - 50 + 12);
        txt.name = "txt_turn";
        this.addChild(txt);
        txt.scale(0, 0);
        Laya.Tween.to(txt, { scaleX: 1 * Global.scaleX, scaleY: 1 * Global.scaleY }, 200);
    }

    __proto.gameOver = function (result, delay) {
        if (this.state == "over")
            return;

        this.state = "over";
        this.timeBar.stopTimeDown(false);
        this.exitBtn.mouseEnabled = false;

        Laya.timer.once(delay, this, function () {
            this.showLoading();
            Laya.timer.clearAll(this);
            Laya.timer.clearAll(this.timeBar);
            if (Global.testType == 0)
                this.showOver(result);
            else
                NetMgr.instance.send('gameover', { 'rst': result });

        }.bind(this));
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

    __proto.getMaxLine = function (color, locations) {
        var array = [];
        var index = 0;
        var n = 1;
        var m = 1;
        for (var i = 0; i < locations.length; i++) {
            n = this.getLine(locations[i][0] + 3, locations[i][1] + 3, color, false);
            if (n > m) {
                m = n;
                index = i;
            }
        }
        array = [m, index];
        return array;
    };

    __proto.getLine = function (i, j, color, isSelected) {
        var a, b;
        var n = 1;
        var m = n;
        var p = n;
        var list = [(i - 3) * Global.maxColumn + j - 3];
        var list1 = [];
        for (a = i + 1; a <= Global.maxRow + 2; a++) {
            if (this.typeList[a][j] == color) {
                n++;
                list[list.length] = (a - 3) * Global.maxColumn + j - 3;
            }
            else {
                break;
            }
        }

        p = n > p ? n : p;
        m = n;
        if (m > 3)
            for (var c = 0; c < list.length; c++)
                list1[list1.length] = list[c];
        n = 1;
        list = [(i - 3) * Global.maxColumn + j - 3];
        for (b = j + 1; b <= Global.maxColumn + 2; b++) {
            if (this.typeList[i][b] == color) {
                n++;
                list[list.length] = (i - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }
        for (b = j - 1; b >= 3; b--) {
            if (this.typeList[i][b] == color) {
                n++;
                list[list.length] = (i - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }

        p = n > p ? n : p;
        m = n;
        if (m > 3)
            for (var c = 0; c < list.length; c++)
                list1[list1.length] = list[c];
        n = 1;
        list = [(i - 3) * Global.maxColumn + j - 3];
        for (a = i + 1, b = j + 1; a <= Global.maxRow + 2 && b <= Global.maxColumn + 2; a++ , b++) {
            if (this.typeList[a][b] == color) {
                n++;
                list[list.length] = (a - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }

        for (a = i - 1, b = j - 1; a >= 3 && b >= 3; a-- , b--) {
            if (this.typeList[a][b] == color) {
                n++;
                list[list.length] = (a - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }

        p = n > p ? n : p;
        m = n;
        if (m > 3)
            for (var c = 0; c < list.length; c++)
                list1[list1.length] = list[c];
        n = 1;
        list = [(i - 3) * Global.maxColumn + j - 3];
        for (a = i + 1, b = j - 1; a <= Global.maxRow + 2 && b >= 3; a++ , b--) {
            if (this.typeList[a][b] == color) {
                n++;
                list[list.length] = (a - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }

        for (a = i - 1, b = j + 1; a >= 3 && b <= Global.maxColumn + 2; a-- , b++) {
            if (this.typeList[a][b] == color) {
                n++;
                list[list.length] = (a - 3) * Global.maxColumn + b - 3;
            }
            else {
                break;
            }
        }

        p = n > p ? n : p;
        m = n;
        if (m > 3)
            for (var c = 0; c < list.length; c++)
                list1[list1.length] = list[c];

        if (isSelected && list1.length > 3) {
            var arr = this.getListArray(list1, (i - 3) * Global.maxColumn + j - 3);
            Laya.timer.once((i - 2) * 50, this, function (arr) {
                for (var c = 0; c < arr.length; c++) {
                    for (var d = 0; d < arr[c].length; d++) {
                        Laya.timer.once(d * 100, this, function (num) {
                            var pawn = this.panel.getChildByName("pawn_" + num);
                            var newPawn = new Pawn(pawn.color);
                            newPawn.pos(pawn.x, pawn.y);
                            newPawn.pivot(pawn.pivotX, pawn.pivotY);
                            newPawn.zOrder = 1000;
                            this.panel1.addChild(newPawn);
                            var func = function () {
                                Laya.Tween.to(newPawn, { scaleX: 1, scaleY: 1 }, 100);
                            };
                            Laya.Tween.to(newPawn, { scaleX: 1.4, scaleY: 1.4 }, 100, null, Laya.Handler.create(this, func));
                        }, [arr[c][d]]);

                        var rect = this.panel1.getChildByName("rect_" + arr[c][d]);
                        rect.graphics.clear();
                        rect.loadImage("texture/game/loop_1.png", -1, 5);
                        rect.alpha = 0;
                        Laya.timer.once((arr[c].length - 1) * 100, this, function (rect) {
                            Laya.Tween.to(rect, { alpha: 1 }, 500);
                        }, [rect]);
                    }
                }
            }, [arr]);
        }
        if (isSelected)
            return list1.length;
        else
            return p;
    };
    __proto.getClearList = function (list) {
        var list1 = [];
        for (var i = 0; i < list.length; i++) {
            var b = true;
            for (var j = 0; j < list1.length; j++) {
                if (list[i] == list1[j])
                    b = false;
            }
            if (b)
                list1[list1.length] = list[i];
        }

        return list1;
    }
    __proto.getListArray = function (list, index) {
        var b = false;
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {
                var column = list[i] % Global.maxColumn;
                var column1 = list[j] % Global.maxColumn;
                if (list[i] != list[j] && column == column1) {
                    b = true;
                    break;
                }
            }
            if (b) break;
        }
        var b1 = false;
        if (b) {
            var n = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i] == index && i != 0) {
                    n = i;
                }
            }
            if (n != 0) {
                var list1 = [];
                var list2 = [];
                for (var i = 0; i < n; i++)
                    list1[list1.length] = list[i];
                for (var i = n; i < list.length; i++)
                    list2[list2.length] = list[i];
                if (list1.length == 4) arr[arr.length] = list1;
                if (list2.length == 4) arr[arr.length] = list2;
            }
            else b1 = true;
        }
        else {
            b1 = true;
        }

        if (b1) {
            var b2 = false;
            for (var i = 1; i < list.length; i++) {
                var row = parseInt("" + list[i - 1] / Global.maxColumn);
                var row1 = parseInt("" + list[i] / Global.maxColumn);
                if (row != row1) {
                    b2 = true;
                    break;
                }
            }
            if (b2 && list.length != 8) {
                var n = 0;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == index && i != 0) {
                        n = i;
                    }
                }
                var list1 = [];
                var list2 = [];
                for (var i = 0; i < n; i++)
                    list1[list1.length] = list[i];
                for (var i = n; i < list.length; i++)
                    list2[list2.length] = list[i];
                if (list1.length >= 4) arr[0] = list1;
                else if (list2.length >= 4) arr[0] = list2;
            }
            else arr[0] = this.getClearList(list);
        }
        if (arr.length == 1) {
            var a = 0;
            for (var i = 0; i < arr[0].length; i++) {
                for (var j = i + 1; j < arr[0].length; j++) {
                    var column = arr[0][i] % Global.maxColumn;
                    var column1 = arr[0][j] % Global.maxColumn;
                    if (column > column1) {
                        a = arr[0][i];
                        arr[0][i] = arr[0][j];
                        arr[0][j] = a;
                    }
                    var row = parseInt("" + arr[0][i] / Global.maxColumn);
                    var row1 = parseInt("" + arr[0][j] / Global.maxColumn);
                    if (row > row1) {
                        a = arr[0][i];
                        arr[0][i] = arr[0][j];
                        arr[0][j] = a;
                    }
                }
            }
        }
        return arr;
    }

    __proto.displayLine = function (i, j, flag, ti, tj, color) {
        i = i - 3;
        j = j - 3;
        ti = ti - 3;
        tj = tj - 3;
        var n;
        if (flag == 0) {
            if (i < ti) {
                for (var a = i; a < ti; a++) {
                    n = a * Global.maxColumn + j;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
        }
        else if (flag == 1) {
            if (j < tj) {
                for (var b = j; b < tj; b++) {
                    n = i * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
            else {
                for (var b = tj + 1; b <= j; b++) {
                    n = i * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
        }
        else if (flag == 2) {
            if (i < ti) {
                for (var a = i, b = j; a < ti && b < tj; a++ , b++) {
                    n = a * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
            else {
                for (var a = ti + 1, b = tj + 1; a <= i && b <= j; a++ , b++) {
                    n = a * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
        }
        else if (flag == 3) {
            if (i < ti) {
                for (var a = i, b = j; a < ti && b > tj; a++ , b--) {
                    n = a * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
            else {
                for (var a = i, b = j; a > ti && b < tj; a-- , b++) {
                    n = a * Global.maxColumn + b;
                    var rect = this.panel1.getChildByName("rect_" + n);
                    rect.graphics.clear();
                    rect.loadImage("texture/game/loop_1.png", -3, 0);
                }
            }
        }
    };


    return GameView;
}(Laya.View));