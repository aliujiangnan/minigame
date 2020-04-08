/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.state = "idle";
        this.num = 4;
        this.size(Laya.stage.width, Laya.stage.height);
        this.initListeners();
        this.initSelf();
        this.initView();
    };

    var black = 0;
    var white = 1;
    var rectWidth = 88.13;
    var rectHeight = 88.18;
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
                case "select":
                    this.oppSelect(data.c, data.r)
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
        panel.loadImage("texture/game/panel.png");
        panel.pivot(panel.width / 2, panel.height / 2);
        panel.pos(Laya.stage.width / 2, Laya.stage.height * 0.54);
        panel.scale(Global.scaleY, Global.scaleX);
        this.addChild(panel);
        this.panel = panel;

        this.typeList = [];
        for (var i = 0; i < Global.maxRow; i++) {
            this.typeList[i] = [];
            for (var j = 0; j < Global.maxColumn; j++) {
                this.typeList[i][j] = -1;
                if (i < Global.maxRow && j < Global.maxColumn) {
                    var rect = new Laya.Sprite();
                    rect.size(rectWidth, rectWidth);
                    rect.pos(rectWidth * (j + 1) - 66, rectWidth * (i + 1) - 68);
                    var n = i * Global.maxColumn + j;
                    rect.name = "rect_" + n;
                    rect.zOrder = 50;
                    this.panel.addChild(rect);
                    rect.on(Laya.Event.MOUSE_DOWN, this, this.onClickRect, [rect]);
                }
            }
        }

        for (var i = 3; i < 5; i++) {
            for (var j = 3; j < 5; j++) {
                var n = i * Global.maxColumn + j;
                var color = 0;
                if (n == 27 || n == 36)
                    color = 1;
                var pawn = new Pawn(color);
                pawn.pos(rectWidth * (j + 1) - 78 + pawn.width / 2 + 12, rectHeight * (i + 1) - 80 + pawn.height / 2 + 12);
                pawn.name = "pawn_" + n;
                pawn.zOrder = 100;
                this.panel.addChild(pawn);
                this.typeList[i][j] = color;
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
        var locationList = this.getUsefulLocation(Global.userColor);
        for (var i = 0; i < locationList.length; i++) {
            var n = locationList[i][0] * Global.maxColumn + locationList[i][1];

            var rect = this.panel.getChildByName("rect_" + n);
            rect.removeChildByName("delta");

            var delta = new Laya.Sprite();
            delta.loadImage("texture/game/delta_2.png", 24, 12);
            delta.name = "delta";

            var y = -10;
            var y1 = 10;
            Laya.Tween.to(delta, { x: 0, y: y1 }, 500);
            Laya.timer.once(500, delta, function (delta) {
                Laya.Tween.to(delta, { x: 0, y: 0 }, 500);
            }, [delta]);
            Laya.timer.loop(1000, delta, function (delta) {
                Laya.Tween.to(delta, { x: 0, y: y1 }, 500);
                Laya.timer.once(500, delta, function (delta) {
                    Laya.Tween.to(delta, { x: 0, y: 0 }, 500);
                }, [delta]);
            }, [delta]);

            rect.addChild(delta);
        }
    };

    __proto.getUsefulLocation = function (color) {
        var opp = color == 0 ? 1 : 0;
        var locations = [];
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                if (this.typeList[i][j] == color) {
                    var a, b;
                    for (a = i + 1; a < Global.maxRow - 1; a++) {
                        if (this.typeList[a][j] == opp) {
                            if (this.typeList[a + 1][j] == -1) {
                                locations[locations.length] = [a + 1, j];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (a = i - 1; a > 0; a--) {
                        if (this.typeList[a][j] == opp) {
                            if (this.typeList[a - 1][j] == -1) {
                                locations[locations.length] = [a - 1, j];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (b = j + 1; b < Global.maxRow - 1; b++) {
                        if (this.typeList[i][b] == opp) {
                            if (this.typeList[i][b + 1] == -1) {
                                locations[locations.length] = [i, b + 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (b = j - 1; b > 0; b--) {
                        if (this.typeList[i][b] == opp) {
                            if (this.typeList[i][b - 1] == -1) {
                                locations[locations.length] = [i, b - 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (a = i + 1, b = j + 1; a < Global.maxRow - 1 && b < Global.maxColumn - 1; a++ , b++) {
                        if (this.typeList[a][b] == opp) {
                            if (this.typeList[a + 1][b + 1] == -1) {
                                locations[locations.length] = [a + 1, b + 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (a = i - 1, b = j - 1; a > 0 && b > 0; a-- , b--) {
                        if (this.typeList[a][b] == opp) {
                            if (this.typeList[a - 1][b - 1] == -1) {
                                locations[locations.length] = [a - 1, b - 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (a = i + 1, b = j - 1; a < Global.maxRow - 1 && b > 0; a++ , b--) {
                        if (this.typeList[a][b] == opp) {
                            if (this.typeList[a + 1][b - 1] == -1) {
                                locations[locations.length] = [a + 1, b - 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    for (a = i - 1, b = j + 1; a > 0 && b < Global.maxColumn - 1; a-- , b++) {
                        if (this.typeList[a][b] == opp) {
                            if (this.typeList[a - 1][b + 1] == -1) {
                                locations[locations.length] = [a - 1, b + 1];
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        return locations;
    };

    __proto.playTimeDown = function (color, time) {
        if (this.state == "over") return;
        this.timeBar.stopTimeDown();
        this.timeBar.startTimeDown(color, time);
    }

    __proto.onClickRect = function (sender) {

        var locationList = this.getUsefulLocation(Global.userColor);
        if (this.state == Global.userColor) {

            var index = parseInt(sender.name.slice(5, sender.name.length));

            for (var i = 0; i < locationList.length; i++) {
                var n = locationList[i][0] * Global.maxColumn + locationList[i][1];
                if (index == n) {
                    this.state = Global.userColor == black ? white : black;
                    this.hiddenUseful();
                    var row = parseInt("" + index / Global.maxColumn);
                    var column = index % Global.maxColumn;
                    var m = this.onSelected(row, column, Global.userColor);

                    if (Global.robotType == 0) {
                        var msg = {
                            type: "select",
                            r: column,
                            c: row,
                        }

                        NetMgr.instance.send('msg', msg);
                    }
                    Laya.timer.once(175 * (m + 2), this, function () {
                        this.playTimeDown(1, 0);
                        this.displayTurn(1);
                        if (this.getUsefulLocation(Global.userColor == 0 ? 1 : 0).length == 0 && this.num < 64) {
                            this.displayPass(Global.userColor == 0 ? 1 : 0);
                            Laya.timer.once(2700, this, function () {
                                this.playTimeDown(0, 0);
                                this.displayTurn(0);
                                if (this.getUsefulLocation(Global.userColor).length == 0 && this.num < 64) {
                                    this.displayPass(Global.userColor);
                                    Laya.timer.once(2700, this, this.gameOver);
                                }
                                else if (this.state != "over") {
                                    this.state = Global.userColor;
                                    this.displayUseful();
                                }
                            });
                        }
                        else if (Global.robotType == 1)
                            Laya.timer.once(2000, this, this.autoSelect);
                    })

                    break;
                }
            }
        }
    };
    __proto.hiddenUseful = function () {
        for (var a = 0; a < Global.maxRow; a++) {
            for (var b = 0; b < Global.maxColumn; b++) {
                var c = a * Global.maxColumn + b;
                var rect = this.panel.getChildByName("rect_" + c);
                rect.removeChildByName("delta");
            }
        }
    };
    __proto.oppSelect = function (i, j) {
        if (this.state != Global.opponentColor) return;
        else if (this.typeList[i][j] != -1) return;

        this.onSelected(i, j, Global.opponentColor);
        Laya.timer.once((i + 1) * 100 + 950, this, function () {
            if (this.state != "over")
                this.state = Global.userColor;
            this.playTimeDown(0);
            this.displayTurn(0);

            if (this.getUsefulLocation(Global.userColor).length == 0 && this.num < 64) {
                this.displayPass(Global.userColor);
                Laya.timer.once(2700, this, function () {
                    this.playTimeDown(1, 0);
                    this.displayTurn(1);
                    if (this.getUsefulLocation(Global.opponentColor).length == 0 && this.num < 64) {
                        this.displayPass(Global.opponentColor);
                        Laya.timer.once(2700, this, this.gameOver);
                    }
                    else if (this.state != "over") {
                        this.state = Global.opponentColor;
                    }
                });
            }
            else {
                this.displayUseful();
            }
        });
    }
    __proto.displayPass = function (color) {

        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/pass.mp3");
        var p = this.getChildByName("pass_" + color);
        if (p != null) return;
        var pass = new Laya.Sprite();
        pass.loadImage("texture/game/pass.png");
        pass.pivot(pass.width / 2, pass.height / 2);
        pass.name = "pass_" + color;
        pass.pos(this.width + pass.width / 2, this.height * 0.3 + 55);
        this.addChild(pass);

        var pawn = new Laya.Sprite();
        pawn.loadImage("texture/game/pawn_" + color + ".png");
        pawn.pivot(pawn.width / 2, pawn.height / 2);
        pawn.pos(330, pass.height / 2);
        pass.addChild(pawn);

        var func2 = function () {
            pass.removeSelf();
        };
        var func1 = function () {
            Laya.Tween.to(pass, { x: - pass.width / 2 }, 100, null, Laya.Handler.create(this, func2));
        };
        var func = function () {
            Laya.Tween.to(pass, { x: this.width / 2 }, 1500, null, Laya.Handler.create(this, func1));
        };
        Laya.Tween.to(pass, { x: this.width * 0.55 }, 100, null, Laya.Handler.create(this, func));
    };
    __proto.autoSelect = function () {
        if (this.state == "over") return;
        var locationList = this.getUsefulLocation(1);
        var robotMax = this.getMaxLine(Global.userColor == 0 ? 1 : 0);
        var i = parseInt((Math.random() * locationList.length).toString());

        this.onSelected(locationList[i][0], locationList[i][1], Global.userColor == 0 ? 1 : 0);
        Laya.timer.once((locationList[i][0] + 1) * 100 + 950, this, function () {
            if (this.state != "over") this.state = Global.userColor;
            this.playTimeDown(0, 0);

            this.displayTurn(0);
            if (this.getUsefulLocation(Global.userColor).length == 0 && this.num < 64) {
                this.displayPass(Global.userColor);
                Laya.timer.once(2700, this, function () {
                    this.playTimeDown(1, 0);
                    this.displayTurn(1);
                    if (this.getUsefulLocation(Global.opponentColor).length == 0 && this.num < 64) {
                        this.displayPass(Global.userColor == 0 ? 1 : 0);
                        Laya.timer.once(2700, this, this.gameOver);
                    }
                    else if (this.state != "over") {
                        this.state = Global.userColor == 0 ? 1 : 0;
                        this.autoSelect();
                    }
                });
            }
            else {
                this.displayUseful();
            }
        });
    };

    __proto.getMaxLine = function (color) {
        var locations = this.getUsefulLocation(color);
        var array = [];
        var index = 0;
        var n = 1;
        var m = 1;
        for (var i = 0; i < locations.length; i++) {
            n = this.getLine(locations[i][0], locations[i][1], color, false);
            if (n > m) {
                m = n;
                index = i;
            }
        }
        array = [m, index];
        return array;
    }

    __proto.onSelected = function (i, j, color) {
        var m = this.getLine(i, j, color);

        var numArray = this.getNum();
        var blackNum = numArray[0];
        var whiteNum = numArray[1];
        this.headBar.setNum(blackNum, whiteNum);
        if (this.num == 64) {
            Laya.timer.once(m * 100 + 650, this, this.gameOver);
            return m;
        }

        return m;
    };
    __proto.getLine = function (i, j, color, isTurn) {
        if (isTurn === void 0) isTurn = true;
        var opp = color == 0 ? 1 : 0;
        var typeList = [[]];
        for (var ti = 0; ti < Global.maxRow; ti++) {
            typeList[ti] = [];
            for (var tj = 0; tj < Global.maxColumn; tj++) {
                typeList[ti][tj] = this.typeList[ti][tj];
            }
        }
        var a, b;
        var n = 1;
        var m = 0;
        for (a = i + 1; a < Global.maxRow - 1; a++) {
            if (typeList[a][j] == opp) {
                n++;
                if (typeList[a + 1][j] == color) {
                    m += m == 0 ? n : n - 1;

                    if (isTurn) this.turn(i, j, 0, a + 1, j, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (a = i - 1; a > 0; a--) {
            if (typeList[a][j] == opp) {
                n++;
                if (typeList[a - 1][j] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 0, a - 1, j, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (b = j + 1; b < Global.maxRow - 1; b++) {
            if (typeList[i][b] == opp) {
                n++;
                if (typeList[i][b + 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 1, i, b + 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (b = j - 1; b > 0; b--) {
            if (typeList[i][b] == opp) {
                n++;
                if (typeList[i][b - 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 1, i, b - 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (a = i + 1, b = j + 1; a < Global.maxRow - 1 && b < Global.maxColumn - 1; a++ , b++) {
            if (typeList[a][b] == opp) {
                n++;
                if (typeList[a + 1][b + 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 2, a + 1, b + 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (a = i - 1, b = j - 1; a > 0 && b > 0; a-- , b--) {
            if (typeList[a][b] == opp) {
                n++;
                if (typeList[a - 1][b - 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 2, a - 1, b - 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (a = i + 1, b = j - 1; a < Global.maxRow - 1 && b > 0; a++ , b--) {
            if (typeList[a][b] == opp) {
                n++;
                if (typeList[a + 1][b - 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 3, a + 1, b - 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }
        n = 1;
        for (a = i - 1, b = j + 1; a > 0 && b < Global.maxColumn - 1; a-- , b++) {
            if (typeList[a][b] == opp) {
                n++;
                if (typeList[a - 1][b + 1] == color) {
                    m += m == 0 ? n : n - 1;
                    if (isTurn) this.turn(i, j, 3, a - 1, b + 1, color);
                    break;
                }
            }
            else {
                break;
            }
        }

        return m;
    }
    __proto.turn = function (i, j, flag, ti, tj, color) {
        var n = i * Global.maxColumn + j;
        if (this.panel.getChildByName("pawn_" + n) == null) {
            var pawn = new Pawn(color);
            pawn.pos(rectWidth * (j + 1) + pawn.width / 2 - 67, rectHeight * (i + 1) + pawn.height / 2 - 88);
            pawn.scale(1.2, 1.2);
            Laya.Tween.to(pawn, { scaleX: 1, scaleY: 1, x: pawn.x + 1, y: pawn.y + 20 }, 300, Laya.Ease.quintInOut);
            pawn.name = "pawn_" + n;
            pawn.zOrder = 100;
            this.panel.addChild(pawn);
            this.num++;
            Laya.timer.once(100, this, function () {
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/fall.mp3");
            });

        }
        else {
            var pawn = this.panel.getChildByName("pawn_" + n);
            pawn.setColor(color);
        }
        this.typeList[i][j] = color;
        if (flag == 0) {
            if (i < ti) {
                for (var a = i + 1, c = 1; a < ti; a++ , c++) {
                    n = a * Global.maxColumn + j;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);

                    }, [pawn_]);
                    this.typeList[a][j] = color;
                }
            }
            else {
                for (var a = i - 1, c = 1; a > ti; a-- , c++) {
                    n = a * Global.maxColumn + j;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[a][j] = color;
                }
            }
        }
        else if (flag == 1) {
            if (j < tj) {
                for (var b = j + 1, c = 1; b < tj; b++ , c++) {
                    n = i * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[i][b] = color;
                }
            }
            else {
                for (var b = j - 1, c = 1; b > tj; b-- , c++) {
                    n = i * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[i][b] = color;
                }
            }
        }
        else if (flag == 2) {
            if (i < ti) {
                for (var a = i + 1, b = j + 1, c = 1; a < ti && b < tj; a++ , b++ , c++) {
                    n = a * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[a][b] = color;
                }
            }
            else {
                for (var a = i - 1, b = j - 1, c = 1; a > ti && b > tj; a-- , b-- , c++) {
                    n = a * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[a][b] = color;
                }
            }
        }
        else if (flag == 3) {
            if (i < ti) {
                for (var a = i + 1, b = j - 1, c = 1; a < ti && b > tj; a++ , b-- , c++) {
                    n = a * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[a][b] = color;
                }
            }
            else {
                for (var a = i - 1, b = j + 1, c = 1; a > ti && b < tj; a-- , b++ , c++) {
                    n = a * Global.maxColumn + b;
                    var pawn_ = this.panel.getChildByName("pawn_" + n);
                    Laya.timer.once(c * 100, this, function (pawn) {
                        pawn.setColor(color);
                    }, [pawn_]);
                    this.typeList[a][b] = color;
                }
            }
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

    __proto.getNum = function () {
        var blackNum = 0;
        var whiteNum = 0;
        for (var i = 0; i < Global.maxRow; i++) {
            for (var j = 0; j < Global.maxColumn; j++) {
                if (this.typeList[i][j] == 0) {
                    blackNum++;
                }
                else if (this.typeList[i][j] == 1) {
                    whiteNum++;
                }
            }
        }
        return [blackNum, whiteNum];
    }
    __proto.displayResult = function (n1, n2) {
        if (Global.isMusicOn) {
            Laya.SoundManager.setSoundVolume(0.1);
            Laya.SoundManager.playSound("sound/result.mp3");
        }

        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg_result.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        bg.scale(0, 0)
        bg.zOrder = 200;
        this.addChild(bg);

        var func = function () {
            Laya.Tween.to(bg, { scaleX: 1 * Global.scaleY, scaleY: 1 * Global.scaleY }, 200);
        }

        Laya.Tween.to(bg, { scaleX: 1.2 * Global.scaleY, scaleY: 1.2 * Global.scaleY }, 200, null, Laya.Handler.create(this, func), 200);

        var left = new Laya.Sprite();
        left.loadImage("texture/game/pawn_" + Global.userColor + ".png");
        left.pivot(left.width / 2, left.height / 2);
        left.scale(0.8, 0.8)
        left.pos(242, bg.height / 2 + 31);
        bg.addChild(left);

        var right = new Laya.Sprite();
        right.loadImage("texture/game/pawn_" + Global.opponentColor + ".png");
        right.pivot(right.width / 2, right.height / 2);
        right.scale(0.8, 0.8)
        right.pos(bg.width - 244, bg.height / 2 + 32);
        bg.addChild(right);

        var txt = new Laya.Text();
        txt.text = "" + n1;
        txt.fontSize = 48;
        txt.color = "#ffffff";
        txt.stroke = 4;
        txt.strokeColor = "#ffffff";
        txt.pivotX = 48;
        if (n1 < 10) txt.pivotX = 36;
        txt.pivotY = 48;
        txt.pos(180, bg.height / 2 + 52);
        bg.addChild(txt);

        var txt1 = new Laya.Text();
        txt1.text = "" + n2;
        txt1.fontSize = 48;
        txt1.color = "#ffffff";
        txt1.stroke = 4;
        txt1.strokeColor = "#ffffff";
        txt1.pivotX = 48;
        if (n1 < 10) txt1.pivotX = 36;
        txt1.pivotY = 48;
        txt1.pos(520, bg.height / 2 + 53);
        bg.addChild(txt1);
    };

    __proto.gameOver = function (result) {
        if (this.state == "over")
            return;

        var isDisplay = result == undefined;
        if (isDisplay) {
            var numArray = this.getNum();
            userNum = numArray[Global.userColor];
            opponentNum = numArray[Global.opponentColor];
            result = userNum > opponentNum ? 1 : (userNum == opponentNum ? 2 : 0);
        }

        this.timeBar.stopTimeDown(false);
        this.state = "over";
        var t = 0;
        if (isDisplay) {
            this.displayResult(userNum, opponentNum);
            t = 2000;
        }

        Laya.timer.once(t, this, function () {
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

    return GameView;
}(Laya.View));