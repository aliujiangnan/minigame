/*
* GameView;
*/
var tex;
function genTex(w, h) {
    tex = [];
    for (var i = 0; i < h * 10; ++i) {
        tex[i] = []
        for (var j = 0; j < w * 10; ++j)
            tex[i][j] = [0, 0, 0, 0, 0];
    }
}

function tex2D(x, y) {
    return tex[y][x];
}

function clearRect(x, y, w, h) {
    for (var i = y; i < y + h; ++i)
        for (var j = x; j < x + w; ++j)
            tex[i][j][0] = 1;
}

function countUsed(l, i) {
    tex[13 * l.row + 7][13 * l.column + 7][i + 1]++;
}

function character(l, a, b) {
    var data = tex2D(13 * l.column + 7 + 6 * a, 13 * l.row + 7 + 6 * b);
    return 1 == data[0] && l.row + a <= ROW && l.column + b <= COL;
}

var POS_X = 2.85, POS_Y = 3, OFFSET_X = -1.4, OFFSET_Y = 220, SCLAE_X = 3, SCLAE_Y = 3;
function drawMask(v, x, y, w, h, c) {
    clearRect(x - 1, y - 1, w, h);
    x *= POS_X;
    y *= POS_Y;
    x += OFFSET_X;
    y += OFFSET_Y;
    w *= SCLAE_X;
    h *= SCLAE_Y;
    v.mask.graphics.drawRect(x, y, w, h, "#ffffff");
}

var ROW = 24, COL = 20;
function mapGen(v, c, e) {

    var a = Array(c);
    var b = Array(c);
    var k = Array(c), q = 1;

    for (cr_l = 0; cr_l < e; cr_l++) {
        for (i = 0; i < c; i++)
            0 == cr_l && (a[i] = 0), drawMask(v, 13 * i + 3, 13 * cr_l + 3, 10, 10), k[i] = 0, 1 == b[i] && (b[i] = a[i] = 0), 0 == a[i] && (a[i] = q++);

        for (i = 0; i < c; i++) {
            k[i] = Math.floor(0.0 + 2.0 * Utils.seededRandom()), b[i] = Math.floor(0.0 + 2.0 * Utils.seededRandom());

            if ((0 == k[i] || cr_l == e - 1) && i != c - 1 && a[i + 1] != a[i]) {
                var l = a[i + 1];
                for (j = 0; j < c; j++) a[j] == l && (a[j] = a[i]);
                drawMask(v, 13 * i + 3, 13 * cr_l + 3, 15, 10);
            }
            cr_l != e - 1 && 0 == b[i] && drawMask(v, 13 * i + 3, 13 * cr_l + 3, 10, 15);
        }

        for (i = 0; i < c; i++) {
            var p = l = 0;
            for (j = 0; j < c; j++)
                a[i] == a[j] && 0 == b[j] ? p++ : l++;
            0 == p && (b[i] = 0, drawMask(v, 13 * i + 3, 13 * cr_l + 3, 10, 15));
        }
    }
};

var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.state = "idle";
        this.initListeners();
        this.initSelf();
        this.initView();
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
                case "move":
                    this.move(data.idx, data.vec, data.loc)
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
        var sp = new Laya.Sprite();
        sp.graphics.drawRect(0, 0, this.width, this.height, "#799ACA");
        this.addChild(sp);

        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg.png");
        bg.y = this.height - bg.height;
        this.addChild(bg);
        this.bg = bg;
        var mask = new Laya.Sprite();
        bg.mask = mask;

        this.isPlayUseful = false;

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 150);
        headBar.zOrder = 10;
        this.addChild(headBar);
        this.headBar = headBar;

        var timeBar = new TimeBar();
        timeBar.pos(this.width / 2, 150);
        timeBar.zOrder = 10;
        this.addChild(timeBar);
        this.timeBar = timeBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 200;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;

        if (Global.isMusicOn) Laya.SoundManager.playMusic("sound/bgm.mp3");
    };
    __proto.initPanel = function (locations) {
        var panel = new Laya.Sprite();
        panel.size(this.width, this.height);
        panel.pivot(this.width / 2, this.height / 2);
        panel.pos(this.width / 2, this.height / 2);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp, [-1]);
        this.addChild(panel);
        this.panel = panel;

        genTex(COL + 10, ROW + 20);
        mapGen(this.bg, COL, ROW, 0, 0);

        this.bg.mask.graphics.drawRect(0, 0, this.width, 221, "#ffffff");
        this.bg.mask.graphics.drawRect(0, 1164, this.width, 200, "#ffffff");
        this.bkVec = { row: 0, column: 0 };
        this.locArr = [];
        this.playerArr = [];
        this.target = locations && locations[0].column == COL - 1 ? { row: 1, column: 0 } : { row: 1, column: COL - 1 };
        var index = Global.robotType == 1 ? 0 : NetMgr.instance.seatIndex;

        for (var i = 0; i < 2; ++i) {
            var loc = locations ? locations[i] : { row: ROW - 1, column: 0 };
            var player = new Player(i, SCLAE_X * 10, SCLAE_Y * 10);
            player.pos((3 + 13 * loc.column) * POS_X + OFFSET_X, (3 + 13 * loc.row) * POS_Y + OFFSET_Y);
            player.zOrder = i == index ? 200 : 100;
            this.panel.addChild(player);
            this.playerArr.push(player);
            this.locArr.push(loc);
        }

        var rocket = new Laya.Sprite();
        rocket.loadImage("texture/game/rocket.png", - 7, - 15);
        rocket.pos((3 + 13 * this.target.column) * POS_X + OFFSET_X + 3, (3 + 13 * this.target.row) * POS_Y + OFFSET_Y);
        this.panel.addChild(rocket);
        rocket.scale(0.8, 0.8);
        this.rocket = rocket;

        var txt = new Laya.Text();
        txt.text = "exit";
        txt.fontSize = 24;
        txt.color = "#ffffff";
        txt.width = 100;
        txt.align = "center";
        var ofs = this.target.column == 0 ? -33 : -33;
        txt.pos(rocket.x + ofs, rocket.y - 42);
        this.panel.addChild(txt);

        var vecArr = [
            { row: 0, column: 1 },
            { row: 1, column: 0 },
            { row: 0, column: -1 },
            { row: -1, column: 0 },
        ];

        var idxArr = [];
        var bkIdx = -1;

        for (var i = 0; i < vecArr.length; ++i) {
            if (vecArr[i].row == this.bkVec.row && vecArr[i].column == this.bkVec.column) {
                bkIdx = i;
                continue;
            }
            else if (character(this.locArr[index], vecArr[i].column, vecArr[i].row))
                idxArr.push(i);
        }

        this.isPlayUseful = true;
        for (var i = 0; i < idxArr.length; ++i)
            this.displayUseful(this.playerArr[index].x + 13, this.playerArr[index].y + 19, idxArr[i]);

        this.isMoving = false;
    };
    __proto.onMouseDown = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.isMoving) return;

        this.hasTouched = true;
        this.beginPos = { x: x, y: y };
    };

    function getS2TAngle(targetPos, thisPos, direction) {
        var angle = 360 * (Math.atan((targetPos.y - thisPos.y) / (targetPos.x - thisPos.x))) / (2 * Math.PI);
        var S2TAngle = 0;

        if (targetPos.x > thisPos.x && targetPos.y > thisPos.y)
            S2TAngle = angle;
        else if (targetPos.x < thisPos.x && !(targetPos.y == thisPos.y))
            S2TAngle = 180 + angle;
        else if (targetPos.x > thisPos.x && targetPos.y < thisPos.y)
            S2TAngle = 360 + angle;
        else if (targetPos.x > thisPos.x && targetPos.y == thisPos.y)
            S2TAngle = 0;
        else if (targetPos.x == thisPos.x && targetPos.y > thisPos.y)
            S2TAngle = 90;
        else if (targetPos.x < thisPos.x && targetPos.y == thisPos.y)
            S2TAngle = 180;
        else if (targetPos.x == thisPos.x && targetPos.y < thisPos.y)
            S2TAngle = 270;
        else if (targetPos.x == thisPos.x && targetPos.y == thisPos.y)
            S2TAngle = 0;

        if (direction > 0)
            return 360 - S2TAngle;

        return -S2TAngle;
    }

    __proto.onMouseMove = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (!this.hasTouched) return;

        var d2 = (x - this.beginPos.x) * (x - this.beginPos.x) + (y - this.beginPos.y) * (y - this.beginPos.y);
        if (d2 < 400) return;

        var vec = { row: 0, column: 0 };
        var angle = getS2TAngle({ x: x, y: y }, this.beginPos, 1);

        if (angle > 45 && angle <= 135)
            vec = { row: -1, column: 0 };
        else if (angle > 135 && angle <= 225)
            vec = { row: 0, column: -1 };
        else if (angle > 225 && angle <= 315)
            vec = { row: 1, column: 0 };
        else if ((angle > 315 && angle <= 360) || (angle > 0 && angle <= 45))
            vec = { row: 0, column: 1 };
        var index = Global.robotType == 0 ? NetMgr.instance.seatIndex : 0;

        this.beginPos = null;
        this.hasTouched = false;

        if (Global.robotType != 1) {
            var msg = { type: "move", idx: NetMgr.instance.seatIndex, loc: this.locArr[index], vec: vec };
            NetMgr.instance.send('msg', msg);
        }
        if (this.move(index, vec) == -1) return;

        if (this.isPlayUseful) {
            for (var i = 0; i < 4; ++i)
                this.panel.removeChildByName("delta_" + i);
            this.isPlayUseful = false;
        }
    };
    __proto.onMouseUp = function (index) {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (!this.hasTouched) return;
        else if (this.beginPos == null) return;

    };

    __proto.playGhost = function () {
        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/warn.wav");

        var ghost = new Laya.Sprite();
        ghost.loadImage("texture/game/ghost.png");
        ghost.pivot(ghost.width / 2, ghost.height / 2);
        ghost.pos(this.width / 2, this.height / 2);
        this.addChild(ghost);
        Laya.Tween.to(ghost, { scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 500, null, Laya.Handler.create(this, function () {
            ghost.removeSelf();
            ghost.destroy();
        }));
    };

    __proto.move = function (index, vec, loc) {
        if (loc) {
            this.locArr[index] = loc;
            this.playerArr[index].pos((3 + 13 * this.locArr[index].column) * POS_X + OFFSET_X, (3 + 13 * this.locArr[index].row) * POS_Y + OFFSET_Y);
        }
        var uidx = Global.robotType == 0 ? NetMgr.instance.seatIndex : 0;

        var move = function (vec) {
            if (this.state == "over" || this.state == "end") return;
            this.locArr[index].row += vec.row;
            this.locArr[index].column += vec.column;
            if (index == uidx && Global.isMusicOn) Laya.SoundManager.playSound("sound/move.mp3");

            var color = new Laya.Sprite();
            color.loadImage("texture/game/color_" + index + ".png");
            var sr = SCLAE_X * 10 / color.width;
            color.rotation = vec.row == 0 ? 90 : 0;
            color.scaleY *= vec.row == 0 ? 1 : 1.065;
            color.pivot(color.width / 2, color.height / 2);
            color.pos(this.playerArr[index].x + SCLAE_X * 10 / 2 + vec.column * SCLAE_X * 10 / 2 * 0.97, this.playerArr[index].y + SCLAE_X * 10 / 2 + vec.row * SCLAE_X * 10 / 2 * 1.06);
            color.visible = false;
            this.panel.addChild(color);

            Laya.timer.once(100, this, function () {
                color.visible = true;
                Laya.Tween.to(color, { alpha: 0 }, 1000, null, Laya.Handler.create(this, function () {
                    color.removeSelf();
                    color.destroy();
                }));
            }.bind(this))

            Laya.Tween.to(this.playerArr[index], { x: (3 + 13 * this.locArr[index].column) * POS_X + OFFSET_X, y: (3 + 13 * this.locArr[index].row) * POS_Y + OFFSET_Y }, 200, null, Laya.Handler.create(this, function (player) {
                if (this.state == "over" || this.state == "end") {
                    return;
                } else if (this.locArr[index].row == this.target.row && this.locArr[index].column == this.target.column) {
                    return this.gameOver(index == uidx ? 1 : 0);
                }
                check(vec)
            }, [this.playerArr[index]]));
        }.bind(this)

        var check = function (vec) {
            if (this.state == "over" || this.state == "end") return;
            this.bkVec = { row: -vec.row, column: -vec.column };
            var vecArr = [
                { row: 0, column: 1 },
                { row: 1, column: 0 },
                { row: 0, column: -1 },
                { row: -1, column: 0 },
            ];

            var idxArr = [];
            var bkIdx = -1;
            for (var i = 0; i < vecArr.length; ++i) {
                if (vecArr[i].row == this.bkVec.row && vecArr[i].column == this.bkVec.column) {
                    bkIdx = i;
                    continue;
                }
                else if (character(this.locArr[index], vecArr[i].column, vecArr[i].row))
                    idxArr.push(i);
            }

            if (idxArr.length == 0) {
                if (Global.robotType == 1 && index != uidx && bkIdx != -1) {
                    move(this.bkVec);
                }
                else if (index == uidx) {
                    this.playGhost();
                    this.isMoving = false;
                }

            }
            else if (idxArr.length == 1) {
                move(vecArr[idxArr[0]]);
            }
            else {
                if (Global.robotType == 1 && index != uidx) {
                    var hasSteps = function (n, vec) {
                        var loc = { row: this.locArr[index].row + vec.row, column: this.locArr[index].column + vec.column };
                        var bkVec = { row: -vec.row, column: -vec.column };
                        var step = 1;
                        var checkStep = function () {
                            var vecArr2 = [];
                            for (var i = 0; i < vecArr.length; ++i) {
                                if ((vecArr[i].row != bkVec.row || vecArr[i].column != bkVec.column) && character(loc, vecArr[i].column, vecArr[i].row))
                                    vecArr2.push(vecArr[i]);
                            }
                            if (step > n - 1) {
                                return true;
                            }
                            else if (loc.row == this.target.row && loc.column == this.target.column) {
                                return true;
                            }
                            else if (vecArr2.length == 0) {
                                return step > n - 1;
                            }
                            else if (vecArr2.length == 1) {
                                ++step;
                                loc.row += vecArr2[0].row;
                                loc.column += vecArr2[0].column;
                                bkVec = { row: -vecArr2[0].row, column: -vecArr2[0].column }
                                return checkStep();
                            }
                            else
                                return true;
                        }.bind(this);
                        return checkStep();
                    }.bind(this);

                    function getMin(l) {
                        var data = tex2D(13 * l.column + 7, 13 * l.row + 7);

                        var arr = [];
                        for (var i = 0; i < idxArr.length; ++i) {
                            if (hasSteps(20, { row: vecArr[idxArr[i]].row, column: vecArr[idxArr[i]].column }))
                                arr.push(idxArr[i]);
                        }

                        if (arr.length == 0) return null;
                        var idx = arr[0] + 1;
                        var m = data[idx];

                        for (var i = 0; i < arr.length; ++i) {
                            var j = arr[i] + 1;
                            if (m > data[j]) {
                                idx = j;
                                m = arr[j];
                            }
                        }
                        return { min: m, i: idx - 1 };
                    }

                    function getBkIdx(bkVec) {
                        for (var i = 0; i < vecArr.length; ++i)
                            if (vecArr[i].row == bkVec.row && vecArr[i].column == bkVec.column)
                                return i;
                    }

                    var t = Math.random() * 400 + 100;

                    countUsed(this.locArr[index], getBkIdx(this.bkVec));
                    var io = getMin(this.locArr[index]);
                    if (io == null) {
                        return move(this.bkVec);
                    }
                    countUsed(this.locArr[index], io.i);
                    Laya.timer.once(t, this, move, [vecArr[io.i]]);
                }
                else if (index == uidx) {
                    this.isMoving = false;

                    this.isPlayUseful = true;
                    for (var i = 0; i < idxArr.length; ++i)
                        this.displayUseful(this.playerArr[index].x + 13, this.playerArr[index].y + 19, idxArr[i]);
                }
            }
        }.bind(this)

        if (Global.robotType == 1 && index != uidx) check({ row: 0, column: 1 });
        else if (character(this.locArr[index], vec.column, vec.row)) {
            if (index == uidx) this.isMoving = true;
            move(vec);
        } else
            return -1;

    };

    __proto.displayUseful = function (x, y, j) {
        var posArr = [[x + 30, y], [x, y + 30], [x - 30, y], [x, y - 30]];
        var arr = [[10, 0], [0, 10], [-10, 0], [0, -10],];

        var delta = new Laya.Sprite();
        delta.loadImage("texture/game/delta_" + j + "_green.png");
        delta.name = "delta_" + j;
        delta.pivot(delta.width / 2, delta.height / 2);
        delta.scale(0.6, 0.6);
        delta.pos(posArr[j][0], posArr[j][1]);
        delta.zOrder = 100;
        this.panel.addChild(delta);

        var x = arr[j][0];
        var y = arr[j][1];

        var i = 1;
        var loopFunc = function (sp) {
            Laya.Tween.to(sp, {
                x: sp.x + x * i,
                y: sp.y + y * i
            }, 500, null, Laya.Handler.create(this, loopFunc, [sp]));

            i *= -1;
        }.bind(this)

        loopFunc(delta);
    }

    __proto.startGame = function (locations) {
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        this.initPanel(locations);

        this.headBar.setHead();

        Laya.timer.once(1500, this, function () {
            this.state = "running";
            this.timeBar.startTimeDown();
            var index = Global.robotType == 0 ? NetMgr.instance.seatIndex : 0;
            if (Global.robotType == 1) this.move(index == 0 ? 1 : 0);
        }.bind(this));
    };

    __proto.gameOver = function (result, delay) {
        if (this.state == "over")
            return;

        this.state = "over";
        this.timeBar.stopTimeDown(false);
        this.exitBtn.mouseEnabled = false;

        var delay = 2500;
        this.isPlayRocket = true;
        if (this.isPlayRocket) {
            Laya.Tween.to(this.playerArr[result == 1 ? NetMgr.instance.index : NetMgr.instance.getOpponent().index], { alpha: 0 }, 300);
            Laya.timer.once(500, this, function () {
                this.rocket.loadImage("texture/game/rocket_1.png", - 7, - 15);
                Laya.Tween.to(this.rocket, { y: this.rocket.y - 400 }, 2000, Laya.Ease.quintIn);
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/fly.mp3");
            }.bind(this))
        }
        else
            delay = 0;

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

    return GameView;
}(Laya.View));