/*
* GameView;
*/

var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.hasTouched = false;
        this.state = "idle";
        this.level = 0;
        this.levelCount = 0;
        this.usefulArr = [];
        this.usenableNum = 4;
        this.initSelf();
    }

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
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("texture/game/bg.png");
        bg.y = this.height - bg.height;
        this.addChild(bg);

        this.initPanel();
        var sp = new Laya.Sprite();
        sp.zOrder = 100;
        sp.pos(this.width / 2, this.height * 0.325);
        this.addChild(sp);
        this.honeycomb = sp;

        this.initLevel();
        this.initBees();
    };
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

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 10;
        this.addChild(headBar);
        this.headBar = headBar;

        img = Laya.loader.getRes("texture/game/bottom.png");
        var bot = new Laya.Sprite();
        bot.graphics.drawTexture(img);
        bot.pivot(img.width / 2, img.height / 2);
        bot.pos(this.width / 2, this.height - img.height / 2);
        bot.height = img.height;
        bot.zOrder = 1200;
        this.addChild(bot);

        img = Laya.loader.getRes("texture/game/bg_btn.png");
        var bgBtn = new Laya.Sprite();
        bgBtn.graphics.drawTexture(img);
        bgBtn.pivot(img.width / 2, img.height / 2);
        bgBtn.pos(this.width / 2, this.height - img.height / 2 - bot.height);
        bgBtn.zOrder = 1200;
        this.addChild(bgBtn);

        img = Laya.loader.getRes("texture/game/btn_left_0.png");
        var btnLeft = new Laya.Button("texture/game/btn_left.png");
        btnLeft.size(img.width, img.height);
        btnLeft.anchorX = 0.5;
        btnLeft.anchorY = 0.5;
        btnLeft.stateNum = 3;
        btnLeft.pos(this.width / 2 - 170, this.height * 0.8 - 3);
        this.addChild(btnLeft);
        btnLeft.zOrder = 1200;
        btnLeft.clickHandler = new Laya.Handler(this, this.onClick, ["left"]);
        this.btnLeft = btnLeft;
        var btnRight = new Laya.Button("texture/game/btn_right.png");
        btnRight.size(img.width, img.height);
        btnRight.anchorX = 0.5;
        btnRight.anchorY = 0.5;
        btnRight.stateNum = 3;
        btnRight.pos(this.width / 2 + 170, this.height * 0.8 - 3);
        this.addChild(btnRight);
        btnRight.clickHandler = new Laya.Handler(this, this.onClick, ["right"]);
        this.btnRight = btnRight;
        btnRight.zOrder = 1200;

        img = Laya.loader.getRes("texture/game/score.png");
        var sp = new Laya.Sprite();
        sp.graphics.drawTexture(img);
        sp.pivot(img.width / 2, img.height / 2);
        sp.pos(355, 150);
        sp.zOrder = 1000;
        this.panel.addChild(sp);

        this.score = 0;
        var txt = new Laya.Text();
        txt.text = "" + this.score;
        txt.fontSize = 32;
        txt.color = "#ffffff";
        txt.stroke = 2;
        txt.strokeColor = "#ffffff";
        txt.zOrder = 1000;
        txt.width = 100;
        txt.align = "left";
        txt.pos(412, 137);
        this.panel.addChild(txt);
        this.scoreTxt = txt;

        this.initUseful();
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
                case "bee_hit_by_bullet":
                    this.beeHitByBullet(data.i, data.j, data.k, data.h, data.x, data.y);
                    break;
                case "player_hit_by_bullet":
                    this.playerHitByBullet(data.i, data.j, data.k, data.x, data.y);
                    break;
                case "player_hit_by_bee":
                    this.playerHitByBee(data.r, data.c, data.i, data.j, data.x, data.y);
                    break;
                case "stop":
                    var index = NetMgr.instance.getOpponent().index;
                    this.playerArr[index].x = data.x;
                    Laya.timer.clearAll(this.playerArr[index]);
                    break;
                case "move":
                    this.move(NetMgr.instance.getOpponent().index, data.d);
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

    __proto.initUseful = function () {
        for (var i = 0; i < 4; ++i) {
            var player = new Laya.Sprite();
            player.loadImage("texture/game/player_1.png");
            player.pivot(player.width / 2, player.height / 2);
            player.scale(0.7, 0.7);
            player.pos(308.5 + i * 45, 200);
            player.zOrder = 1000;
            player.name = "useful_" + i;
            player.visible = false;
            this.panel.addChild(player);
            this.usefulArr.push(player);
        }
    }
    __proto.clearLevel = function () {
        for (var i = 0; i < this.playerArr.length; i++) {
            if (this.playerArr[i] == null) continue;
            this.playerArr[i].removeSelf();
            this.playerArr[i].destroy();
        }
        for (var i = 0; i < this.beeArr.length; i++) {
            for (var j = 0; j < this.beeArr[i].length; ++j) {
                if (this.beeArr[i][j] == null) continue;
                this.beeArr[i][j].removeSelf();
                this.beeArr[i][j].destroy();
            }
        }
        for (var i = 0; i < this.attackBeeArr.length; ++i) {
            this.attackBeeArr[i].removeSelf();
            this.attackBeeArr[i].destroy();
        }

        for (var i = 0; i < this.bulletArr.length; i++) {
            for (var j = 0; j < this.bulletArr[i].length; ++j) {
                this.bulletArr[i][j].removeSelf();
                this.bulletArr[i][j].destroy();
            }
        }
    }

    __proto.initLevel = function () {
        this.backBeeArr = [];

        for (var i = 0; i < this.usefulArr.length; ++i) {
            this.usefulArr[i].visible = true;
        }

        this.level = this.levelCount % 5;
        this.bulletArr = [[], [], []];
        this.beeArr = [];
        this.attackBeeArr = [];
    }
    __proto.initBees = function () {
        this.levelData = Global.levelData["" + this.level];
        var dataArr = this.levelData.data;
        this.honeycomb.size(this.levelData.maxWidth * Global.levelData.rowWidth, this.levelData.height * Global.levelData.colHeight);
        this.honeycomb.pivot(this.honeycomb.width / 2, this.honeycomb.height / 2);
        this.honeycomb.pos(this.width / 2, this.honeycomb.y);
        for (var i = 0; i < dataArr.length; ++i) {
            this.beeArr.push([]);
            for (var j = 0; j < dataArr[i].length; ++j) {
                if (dataArr[i][j] == -1) {
                    this.beeArr[i].push(null);
                    continue;
                }
                var bee = new Bee(dataArr[i][j]);
                bee.pos(this.honeycomb.width / 2 + (j - (dataArr[i].length - 1) / 2) * Global.levelData.rowWidth, i * Global.levelData.colHeight);
                bee.row = i;
                bee.column = j;
                this.honeycomb.addChild(bee);
                bee.honeycomb = this.honeycomb;
                this.beeArr[i].push(bee);
            }
        }
        this.beeNum = this.levelData.num;
    };

    __proto.initPlayer = function () {
        this.playerArr = [];
        var index = NetMgr.instance.seatIndex;
        for (var i = 0; i < 2; ++i) {
            var player = new Player(i);
            player.pos(this.width * 0.25 + this.width * 0.5 * i, this.height * 0.65);
            player.zOrder = index == i ? 101 : 100;

            this.panel.addChild(player);
            this.playerArr.push(player);
        }
    };

    __proto.attack = function () {
        if (this.state != "running") return;
        var beeNum = 0;
        for (var i = 0; i < this.beeArr.length; ++i) {
            for (var j = 0; j < this.beeArr[i].length; ++j)
                if (this.beeArr[i][j] != null && this.beeArr[i][j].state == "idle")
                    beeNum++;
        }

        var getAttackLoc = function () {
            if (beeNum == 0) return null;
            var r = parseInt(Utils.seededRandom() * this.beeArr.length);
            var c = parseInt(Utils.seededRandom() * this.beeArr[r].length);
            if (this.beeArr[r][c] == null || this.beeArr[r][c].state != "idle")
                return getAttackLoc();
            return { r: r, c: c };
        }.bind(this);

        var loc = getAttackLoc();
        if (loc != null) {
            var r = loc.r;
            var c = loc.c;
            if (this.beeArr[r][c] != null && this.beeArr[r][c].state == "idle") {
                var x = this.beeArr[r][c].x;
                var y = this.beeArr[r][c].y;
                this.beeArr[r][c].removeSelf();
                this.beeArr[r][c].pos(x + this.honeycomb.x - this.honeycomb.width / 2, y + this.honeycomb.y - this.honeycomb.height / 2);
                this.panel.addChild(this.beeArr[r][c]);
                var index = parseInt(Utils.seededRandom() * 2);
                if (this.playerArr[index] == null) index = index == 0 ? 1 : 0;
                var spd = Global.levelData.beeMoveSpeed * (1 + this.levelCount * Global.levelData.speedAddRate);
                if (spd >= 260) spd = 260;
                this.beeArr[r][c].attack(spd, this.playerArr[index]);
                this.attackBeeArr.push(this.beeArr[r][c]);
            }

            var b = Utils.seededRandom() > 0.8;
            if (b) {
                var t1 = Utils.seededRandom() * 2000 + 2000;
                Laya.timer.once(t1, this, function () {
                    if (this.beeArr[r][c] == null) return;
                    this.shoot(2, this.beeArr[r][c])
                }.bind(this));
            }
        }
        var t = Utils.seededRandom() * 5000 + 5000;
        Laya.timer.once(t, this, this.attack);
    }

    __proto.dead = function (index) {
        for (var i = 0; i < this.usefulArr.length; ++i)
            this.usefulArr[i].visible = i < this.usenableNum;
    }

    __proto.updateUseble = function (num) {
        if (num >= this.usenableNum) return;
        this.usenableNum = num;
        for (var i = 0; i < this.usefulArr.length; ++i)
            this.usefulArr[i].visible = i < this.usenableNum;
    }

    __proto.revive = function (index) {
        var player = this.playerArr[index];
        player.setInvincible(true);
    }
    __proto.playerHitByBee = function (r, c, i, j, x, y) {
        var bee = this.beeArr[r][c];
        if (bee == null) return;
        bee.hitable = false;
        this.beeArr[r][c] = null
        this.attackBeeArr.splice(i, 1);
        bee.removeSelf();
        bee.destroy();
        this.playHit(0, x, y);
        this.dead(j);

        --this.beeNum;
        if (this.usenableNum != 0) Laya.timer.once(200, this, this.revive, [j]);

        if (this.usenableNum == 0) return this.levelOver(false);
        else if (this.beeNum == 0) return this.levelOver(true);

        this.updateUseble(this.usenableNum);
    }
    __proto.playerHitByBullet = function (i, j, k, x, y) {
        if (j >= this.bulletArr[i].length) return;
        var bullet = this.bulletArr[i][j];
        if (bullet) {
            this.bulletArr[i].splice(j, 1);
            bullet.removeSelf();
            bullet.destroy();
        }
        this.playHit(0, x, y);
        this.dead(k);
        if (this.usenableNum != 0) Laya.timer.once(200, this, this.revive, [k]);
        else if (this.usenableNum == 0) return this.levelOver(false);

        this.updateUseble(this.usenableNum);
    }
    __proto.updateBeeArr = function (arr, score) {
        for (var i = 0; i < this.beeArr.length; ++i) {
            for (var j = 0; j < this.beeArr[i].length; ++j)
                if (this.beeArr[i][j] && arr[i][j] < this.beeArr[i][j].type) {
                    if (arr[i][j] == -1) {
                        this.beeArr[i][j].removeSelf();
                        this.beeArr[i][j].destroy();
                        this.beeArr[i][j] = null;
                        this.beeNum--;
                    }
                    else if (arr[i][j] >= 0) {
                        this.beeArr[i][j].change(arr[i][j]);
                    }
                }
        }

        if (score > this.score) {
            this.score = score;
            this.scoreTxt.text = "" + score;
        }

    }
    __proto.beeHitByBullet = function (i, j, k, h, x, y) {
        var bee = this.beeArr[k][h];
        this.playScore(1, x, y);
        this.playHit(1, x, y);
        ++this.score;
        this.scoreTxt.text = "" + this.score;

        if (bee != null && bee.type == 0) {
            this.beeArr[k][h] = null;
            bee.removeSelf();
            bee.destroy();
            --this.beeNum;
            if (bee.state != "idle") {
                var index = this.attackBeeArr.indexOf(bee);
                this.attackBeeArr.splice(index, 1);
            }

            if (this.beeNum == 0) return this.levelOver(true);
        }
        else if (bee != null) {
            bee.change();
        }
    }
    __proto.frameCall = function () {
        if (this.state != "running") {
            Laya.timer.clear(this, this.frameCall);
            return;
        }
        for (var i = 0; i < this.attackBeeArr.length; i++) {
            var bee = this.attackBeeArr[i];
            for (var j = 0; j < this.playerArr.length; j++) {
                var player = this.playerArr[j];

                if (!bee.backFlag && bee.y > this.height) {
                    bee.backFlag = true;
                    Laya.timer.clearAll(bee);
                    this.backBeeArr.push(bee);
                }
                else if (player != null && !player.invincible && Utils.isHit(player.x, player.y, player.width / 2, bee.x, bee.y)) {
                    //蜜蜂击中玩家
                    if (Global.robotType == 0) {
                        var index = NetMgr.instance.seatIndex;
                        if (index != j) return;
                        var msg = {
                            type: "player_hit_by_bee",
                            r: bee.row, c: bee.column, i: i, j: j, x: player.x, y: player.y
                        }

                        NetMgr.instance.send('bcast', msg);
                    }
                    else {
                        this.playerHitByBee(bee.row, bee.column, i, j, player.x, player.y)
                    }

                    if (Global.isMusicOn) Laya.SoundManager.playSound("sound/explode_0.mp3");
                }
            }
        }

        for (var i = 0; i < this.bulletArr.length; i++) {
            for (var j = 0; j < this.bulletArr[i].length; j++) {
                var bullet = this.bulletArr[i][j];
                if (bullet.hitable == false) continue;
                if (Utils.isOut(bullet.x, bullet.y, bullet.width / 2, this.width, this.height)) {
                    this.bulletArr[i].splice(j, 1);
                    bullet.removeSelf();
                    bullet.destroy();
                    if (i != 2) this.shoot(i);
                }
                else if (i == 2) {
                    for (var k = 0; k < this.playerArr.length; ++k) {
                        var player = this.playerArr[k];
                        if (player != null && !player.invincible && Utils.isHit(player.x, player.y, player.width / 2, bullet.x, bullet.y)) {
                            //子弹击中玩家
                            bullet.hitable = false;
                            if (Global.robotType == 0) {
                                var index = NetMgr.instance.seatIndex;
                                if (index != k) continue;
                                var msg = {
                                    type: "player_hit_by_bullet",
                                    i: i, j: j, k: k, x: player.x, y: player.y
                                }

                                NetMgr.instance.send('bcast', msg);
                            }
                            else
                                this.playerHitByBullet(i, j, k, player.x, player.y);

                            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/explode_0.mp3");
                        }
                    }
                }
                else {
                    for (var k = 0; k < this.beeArr.length; ++k) {
                        for (var h = 0; h < this.beeArr[k].length; ++h) {
                            if (this.beeArr[k][h] == null) continue;
                            var bee = this.beeArr[k][h];
                            var ox = bee.state != "idle" ? 0 : this.honeycomb.x - this.honeycomb.width / 2;
                            var oy = bee.state != "idle" ? 0 : this.honeycomb.y - this.honeycomb.height / 2;
                            if (Utils.isHit(bee.x + ox, bee.y + oy, bee.width / 2, bullet.x, bullet.y)) {
                                //子弹击中蜜蜂
                                bullet.hitable = false;
                                this.bulletArr[i].splice(j, 1);
                                bullet.removeSelf();
                                bullet.destroy();
                                this.shoot(i);
                                if (Global.robotType == 0) {
                                    var index = NetMgr.instance.seatIndex;
                                    if (index != i) continue;
                                    var msg = {
                                        type: "bee_hit_by_bullet",
                                        i: i, j: j, k: k, h: h, x: bullet.x, y: bullet.y
                                    }

                                    NetMgr.instance.send('bcast', msg);
                                }
                                else {
                                    this.beeHitByBullet(i, j, k, h, bullet.x, bullet.y);
                                }

                                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/explode_1.mp3");
                            }
                        }
                    }
                }
            }
        }
    }
    __proto.playScore = function (score, x, y) {
        var txt = new Laya.Text();
        txt.width = 100;
        txt.wordWrap = true;
        txt.text = "+" + score;
        txt.font = "sz0-laya";
        txt.leading = 5;
        txt.pos(x, y);

        this.panel.addChild(txt);

        Laya.Tween.to(txt, { y: txt.y - 200, alpha: 0.3 }, 1000, null, Laya.Handler.create(this, function () {
            txt.removeSelf();
            txt.destroy();
        }));
    }
    __proto.updateBees = function () {
        this.attack();

        Laya.timer.frameLoop(1, this, this.frameCall);
    };

    __proto.initPanel = function () {
        this.panel = new Laya.Sprite();
        this.panel.zOrder = 201;
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.addChild(this.panel);
    };

    __proto.onMouseDown = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.hasTouched) return;

        this.hasTouched = true;
        this.beginPos = { x: x, y: y };
        var index = NetMgr.instance.seatIndex;
        Laya.timer.clearAll(this.playerArr[index]);
        if (x < this.width / 2 && Utils.isCollsion(this.btnLeft.x, this.btnLeft.y, this.btnLeft.width, this.btnLeft.height, x, y, 1, 1)) {
            this.move(index, -1);
            if (Global.robotType == 0) {
                var msg = {
                    type: "move",
                    d: -1
                }

                NetMgr.instance.send('msg', msg);
            }
        }
        else if (x > this.width / 2 && Utils.isCollsion(this.btnRight.x, this.btnRight.y, this.btnRight.width, this.btnRight.height, x, y, 1, 1)) {
            this.move(index, 1);
            if (Global.robotType == 0) {
                var msg = {
                    type: "move",
                    d: 1
                }

                NetMgr.instance.send('msg', msg);
            }
        }
    };

    __proto.move = function (index, direction) {
        var count = 0;
        Laya.timer.frameLoop(1, this.playerArr[index], function () {
            if (this.playerArr[index] == null) return;
            this.playerArr[index].x += 2 * direction;
            if (this.playerArr[index].x <= 0 && direction < 0)
                this.playerArr[index].x = 0;
            else if (this.playerArr[index].x >= 750 && direction > 0)
                this.playerArr[index].x = 750;
        }.bind(this));
    };

    __proto.onMouseUp = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (!this.hasTouched) return;

        this.hasTouched = false;
        this.beginPos = null;
        this.curPos = null;

        var index = NetMgr.instance.seatIndex;
        Laya.timer.clearAll(this.playerArr[index]);

        if (Global.robotType == 0) {
            var msg = {
                type: "stop",
                x: this.playerArr[index].x
            }

            NetMgr.instance.send('msg', msg);
        }
    };

    __proto.onMouseMove = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.isAlive == false) return;
        else if (this.hasTouched == false) return;
        else if (this.beginPos == null) return;

        var d2 = (x - this.beginPos.x) * (x - this.beginPos.x) + (y - this.beginPos.y) * (y - this.beginPos.y);
        if (d2 < 400) return;

        var vec = { row: 0, column: 0 };
        var angle = Utils.getS2TAngle({ x: x, y: y }, this.beginPos, 1);
        if (angle > 45 && angle <= 135)
            vec = { row: -1, column: 0 };
        else if (angle > 135 && angle <= 225)
            vec = { row: 0, column: -1 };
        else if (angle > 225 && angle <= 315)
            vec = { row: 1, column: 0 };
        else if ((angle > 315 && angle <= 360) || (angle > 0 && angle <= 45))
            vec = { row: 0, column: 1 };
        var index = 0;
    };

    __proto.onClick = function (arg) {
        if (this.state != "running") return;

    };
    __proto.startLevel = function () {
        var level = new Laya.Sprite();
        level.loadImage("texture/game/level.png");
        level.pivot(level.width / 2, level.height / 2);
        level.pos(this.width / 2 - 15, this.height / 2);
        level.zOrder = 1000;
        this.panel.addChild(level);

        var txt = new Laya.Text();
        txt.text = "" + (this.levelCount + 1);
        txt.fontSize = 64;
        txt.zOrder = 1000;
        txt.width = 100;
        txt.font = "level_sz-laya";
        txt.align = "left";
        txt.pos(190, -5);
        level.addChild(txt);

        var index = NetMgr.instance.seatIndex;
        var player = this.playerArr[index];
        var img = Laya.loader.getRes("texture/game/you.png");
        var you = new Laya.Sprite();
        you.loadImage("texture/game/you.png");
        you.pivot(you.width / 2, you.height / 2);
        you.pos(player.width / 2, -50);
        player.addChild(you);

        Laya.timer.once(2500, this, function () {
            you.removeSelf();
            you.destroy();
        });

        Laya.timer.once(1500, this, function () {
            level.removeSelf();
            level.destroy();
            this.state = "running";
            this.updateBullet();
            this.updateBees();
            this.updateHoneycomb();
        }.bind(this));
    };
    __proto.updateHoneycomb = function (n) {
        var n = this.honeycomb.x > this.width / 2 ? -1 : 1;
        Laya.Tween.to(this.honeycomb, { x: this.width / 2 + n * (this.honeycomb.width / 2 - 150) }, 3000, null, Laya.Handler.create(this, function () {
            if (this.backBeeArr.length == 0) return;
            var bee = this.backBeeArr[0];
            this.backBeeArr.splice(0, 1);
            var func = function () {
                var i = this.attackBeeArr.indexOf(bee);
                this.attackBeeArr.splice(i, 1);
            }.bind(this)
            if (bee.getStyle() == null) {
                this.beeNum--;
                this.beeArr[bee.row][bee.column] = null;
                this.backBeeArr.pop();
                bee.removeSelf();
                bee.destroy();
            }
            bee.back(func);
        }.bind(this)));

        Laya.timer.once(8000, this, function () {
            this.updateHoneycomb();
        }.bind(this));
    };
    __proto.startGame = function (time) {
        this.initListeners();
        this.initView();
        this.initPlayer();
        this.headBar.setHead();

        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        Laya.timer.once(1500, this, function () {
            this.startLevel();
            if (Global.robotType == 1) this.updateRobot();
        }.bind(this));
    };

    __proto.updateRobot = function () {

    }

    __proto.shoot = function (index, bee) {
        var bullet = new Laya.Sprite();
        var speedX = 0, speedY = 0;
        if (index != 2) {
            if (this.bulletArr[index].length > 0) return;
            else if (this.playerArr[index] == null) return;
            var img = Laya.loader.getRes("texture/game/player_bullet_" + index + ".png");
            bullet.graphics.drawTexture(img);
            bullet.pivot(img.width / 2, img.height / 2);
            bullet.size(img.width, img.height);
            bullet.pos(this.playerArr[index].x, this.playerArr[index].y);
            speedY = -Global.levelData.playerBulletSpeed;
            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/bullet.mp3");
        }
        else {
            var img = Laya.loader.getRes("texture/game/bee_bullet.png");
            bullet.graphics.drawTexture(img);
            bullet.pivot(img.width / 2, img.height / 2);
            bullet.size(img.width, img.height);
            bullet.pos(bee.x, bee.y);
            var index1 = parseInt(Utils.seededRandom() * 2);
            if (this.playerArr[index1] == null) index1 = index1 == 0 ? 1 : 0;
            var player = this.playerArr[index1];
            var oa = Utils.seededRandom() * 30 * (player.x > this.width / 2 ? -1 : 1);
            var angle = 180 + Utils.getS2TAngle({ x: bee.x, y: bee.y }, { x: player.x, y: player.y }, 1) + oa;
            bullet.rotation = 90 - angle;
            speedX = Math.cos(2 * Math.PI * angle / 360) * Global.levelData.beeBulletSpeed;
            speedY = -Math.sin(2 * Math.PI * angle / 360) * Global.levelData.beeBulletSpeed;
        }
        bullet.hitable = true;
        this.panel.addChild(bullet);
        this.bulletArr[index].push(bullet);
        Laya.timer.frameLoop(1, bullet, function (speedX, speedY) {
            bullet.x += speedX / 60;
            bullet.y += speedY / 60;
        }, [speedX, speedY]);
    };

    __proto.updateBullet = function () {
        for (var i = 0; i < 2; ++i) {
            this.shoot(i);
        }
    };

    __proto.levelOver = function (isPass) {
        if (isPass) {
            this.addLevel(this.levelCount);
        }
        else
            this.gameOver(this.score);
    }

    __proto.playHit = function (i, x, y) {
        var anim = new Laya.Animation();
        anim.play(0, false, "boom_" + i);
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(x, y);
        anim.zOrder = 200;
        this.panel.addChild(anim);
        Laya.timer.once(200, this.panel, function (anim) {
            anim.removeSelf();
            anim.destroy();
        }, [anim]);
    }

    __proto.clearTimers = function () {
        Laya.timer.clear(this, this.attack);
        Laya.timer.clear(this, this.updateBees);
        Laya.timer.clear(this, this.shoot);
        Laya.timer.clear(this, this.updateRobot);
        Laya.timer.clear(this, this.frameCall);
        Laya.timer.clear(this, this.updateHoneycomb);
        Laya.timer.clearAll(this);
    };

    __proto.addLevel = function (level) {
        this.state = "over";
        this.clearTimers();
        this.clearLevel();
        this.levelCount++;
        this.initLevel();
        this.initBees();
        this.startLevel();

        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/levelup.mp3");
    }

    GameView.prototype.gameOver = function (score) {
        if (this.state == "over") return;
        this.state = "over";
        this.clearLevel();
        for (var i = 0; i < this.attackBeeArr.length; ++i)
            this.attackBeeArr[i].stopAction();
        Laya.SoundManager.stopAll();

        this.showLoading();
        Laya.timer.clearAll(this);
        Laya.timer.clearAll(this.timeBar);
        if (Global.testType == 0)
            this.showOver(score);
        else
            NetMgr.instance.send('gameover', { 'rst': score });
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