/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.hasTouched = false;
        this.isMoving = false;
        this.isRobotParsing = false;
        this.state = "idle";
        this.isPlayLaser = false;
        this.isPlayHit = [false, false];
        this.hpArr = [100, 100];
        this.laserArr = [null, null];
        this.shootEableArr = [true, true];
        this.isMutiArr = [false, false];
        this.isAlive = [true, true];
        this.firstDead = false;
        this.hasBlood = false;
        this.isPlaySkill = false;
        this.beginInfos = [];
        this.beginPoses = [];
        this.mouseOut = false;
        this.touchId = -1;
        this.curX = -1;
        this.curY = -1;
        this.initListeners();
        this.initSelf();
        this.initView();
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

        var addHandler = function (e, h) {
            this.listeneres.push({ e: e, h: h });
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("player_msg", function (data) {
            switch (data.type) {
                case "move":
                    this.move(data.pos);
                    break;
                case "rotate":
                    this.rotate(data.rot);
                    break;
                case "skill":
                    this.playSkill(1, data.typeid, data.time);
                    break;
                case "hit_by_bullet":
                    this.hitByBullet(data.hp, data.idx == 0 ? 1 : 0, data.i == 0 ? 1 : 0, 750 - data.x, 1334 - data.y);
                    break;
                case "hit_by_laser":
                    this.hitByLaser(data.hp, data.idx == 0 ? 1 : 0, data.i == 0 ? 1 : 0, 750 - data.x, 1334 - data.y);
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

        var line = new Laya.Sprite();
        line.loadImage("texture/game/line.png");
        line.pivot(line.width / 2, line.height / 2);
        line.pos(this.width / 2, this.height / 2);
        this.addChild(line);

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 100;
        this.addChild(headBar);
        this.headBar = headBar;

        var timeBar = new TimeBar(60);
        timeBar.pos(this.width / 2, 180);
        timeBar.zOrder = 100;
        this.addChild(timeBar);
        this.timeBar = timeBar;

        var emojiBar = new EmojiBar();
        emojiBar.pos(this.width * 0.85, this.height * 0.92);
        emojiBar.zOrder = 200;
        this.addChild(emojiBar);
        this.emojiBar = emojiBar;

        this.initPanel();
        this.pgArr = [];

        var posArr1 = [
            { x: this.width * 0.95, y: this.height * 0.67 },
            { x: this.width * 0.05, y: this.height * 0.33 }
        ];

        this.playerArr = [];
        for (var i = 0; i < 2; ++i) {
            player = new Player(i);
            player.rotation = i * 180;
            player.pos(this.width / 2, i == 0 ? this.height * 0.7 : this.height * 0.3);
            player.zOrder = 100;
            this.panel.addChild(player);
            this.playerArr.push(player);

            var pg = new Laya.ProgressBar("texture/game/hp_" + i + ".png")
            pg.anchorX = 0.5;
            pg.anchorY = 0.5;
            pg.sizeGrid = "5,5,5,5";
            this.panel.addChild(pg);
            pg.pos(posArr1[i].x, posArr1[i].y);
            pg.rotation = -90 + i * 180;
            pg.value = 1;
            this.pgArr.push(pg);
        }

        var posArr = [
            { x: this.width * 0.1, y: this.height * 0.6 },
            { x: this.width * 0.1, y: this.height * 0.7 },
            { x: this.width * 0.9, y: this.height * 0.4 },
            { x: this.width * 0.9, y: this.height * 0.3 }
        ];

        this.skillArr = [];
        for (var i = 0; i < 4; ++i) {
            var skill = new Skill(i, this.robotSkill.bind(this));
            this.panel.addChild(skill);
            skill.pos(posArr[i].x, posArr[i].y);
            if (i < 2) skill.on(Laya.Event.MOUSE_DOWN, this, this.onClick, [skill]);
            this.skillArr.push(skill);
        }

        if (Global.isMusicOn) Laya.SoundManager.playMusic("sound/bgm.mp3");
    };

    __proto.initPanel = function () {
        this.panel = new Laya.Sprite();
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.on(Laya.Event.MOUSE_OUT, this, function () {

        });
        this.addChild(this.panel);
    };

    __proto.playBlood = function () {
        var blood = new Laya.Sprite();
        blood.loadImage("texture/game/blood.png");
        this.addChild(blood);
        blood.zOrder = 1000;

        var bloodFn = function (blood) {
            Laya.Tween.to(blood, { alpha: Math.abs(blood.alpha - 1) }, 500, null, Laya.Handler.create(this, bloodFn, [blood]));
        }.bind(this);

        bloodFn(blood);
        this.hasBlood = true;
    };

    __proto.onTimeOver = function (timeBar) {
        var result = this.hpArr[0] > this.hpArr[1] ? 1 : 0;
        result = this.hpArr[0] == this.hpArr[1] ? 2 : result;
        this.gameOver(result);
    };

    __proto.onMouseDown = function (e) {
        if (this.touchId == -1)
            this.touchId = e.touchId;
        else if (this.touchId != e.touchId)
            return;

        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        for (var i = 0; i < this.skillArr.length; ++i) {
            if (Utils.getP2PDistance({ x: x, y: y }, { x: this.skillArr[i].x, y: this.skillArr[i].y }) < this.skillArr[i].width / 2) {
                return;
            }
        }

        this.beginPoses[0] = ({ x: x, y: y });
        this.beginInfos[0] = ({ x: this.playerArr[0].x, y: this.playerArr[0].y, rotation: this.laserArr[0] != null ? this.laserArr[0].rotation : 0 });
    };

    __proto.onMouseMove = function (e) {
        if (this.touchId == -1)
            this.touchId = e.touchId;
        else if (this.touchId != e.touchId)
            return;

        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.isAlive[0] == false) return;
        else if (this.beginInfos.length == 0) return;
        else if (this.beginPoses.length == 0) return;

        this.beginPos = this.beginPoses[0];
        this.beginInfo = this.beginInfos[0];

        this.curX = x;
        this.curY = y;

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

        if (!this.isPlayLaser) {

            this.playerArr[0].pos(this.beginInfo.x + (x - this.beginPos.x), this.beginInfo.y + (y - this.beginPos.y));
            if (this.playerArr[0].y < this.height / 2 + this.playerArr[0].height / 2) this.playerArr[0].y = this.height / 2 + this.playerArr[0].height / 2;
            if (this.playerArr[0].y > this.height - this.playerArr[0].height / 2) this.playerArr[0].y = this.height - this.playerArr[0].height / 2;
            if (this.playerArr[0].x < 0 + this.playerArr[0].width / 2) this.playerArr[0].x = 0 + this.playerArr[0].width / 2;
            if (this.playerArr[0].x > this.width - this.playerArr[0].width / 2) this.playerArr[0].x = this.width - this.playerArr[0].width / 2;
            if (Global.robotType != 1) {
                var position = { x: this.width - this.playerArr[0].x, y: this.height - this.playerArr[0].y };
                var msg = {
                    type: "move",
                    pos: position
                }
                NetMgr.instance.send('msg', msg);
            }
        }
        else {
            var player = this.playerArr[0];
            var angle1 = Utils.getS2TAngle({ x: player.x, y: player.y + 300 }, this.beginPos, 1);
            var angle2 = Utils.getS2TAngle({ x: player.x, y: player.y + 300 }, { x: x, y: y }, 1);
            var angle3 = angle2 - angle1;
            this.laserArr[0].rotation = this.beginInfo.rotation - angle3;
            player.rotation = this.laserArr[0].rotation;
            this.curPos = { x: x, y: y };
            if (Global.robotType != 1) {
                var msg = {
                    type: "rotate",
                    rot: this.laserArr[0].rotation + 180
                }
                NetMgr.instance.send('msg', msg);
            }
        }
    };

    __proto.move = function (pos) {
        this.playerArr[1].pos(pos.x, pos.y);
    };

    __proto.rotate = function (rotation) {
        if (this.laserArr[1] == null) return;
        this.laserArr[1].rotation = rotation;
        this.playerArr[1].rotation = rotation;
    };

    __proto.onMouseUp = function (e) {
        this.touchId = -1;
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.isPlaySkill) return;

        this.beginPos = null;
        if (this.beginPoses.length > 0) this.beginPoses.pop();
        if (this.beginInfos.length > 0) this.beginInfos.pop();
        this.beginInfo = null;
        this.curX = -1;
        this.curY = -1;
    };

    __proto.playLaser = function (index) {
        var anim = new Laya.Animation();
        anim.play(0, true, "bullet_" + index + "_1");
        var bounds = anim.getBounds();
        var player = this.playerArr[index];
        anim.pivot(bounds.width / 2, bounds.height);
        anim.pos(player.x, player.y);
        anim.rotation = index * 180;
        this.panel.addChild(anim);
        this.laserArr[index] = anim;

        this.curPos = this.beginPos;
        Laya.timer.once(3000, this, function () {
            anim.removeSelf();
            anim.destroy();
            this.laserArr[index] = null;
            if (index == 0) this.isPlayLaser = false;
            this.shootEableArr[index] = true;
            if (this.state == "running") Laya.timer.loop(1000, this, this.shoot);
            player.rotation = index * 180;
            if (this._hasTouched) {
                this.beginPos = this.curPos;
            }
            else {
                this.beginPos = this.curPos = null;
            }

            if (index == 0) {
                this.isPlaySkill = false;
                if (this.beginPoses.length > 0 && this.curX != -1 && this.curY != -1) {
                    this.beginPoses[0] = { x: this.curX, y: this.curY };
                }
                if (this.beginInfos.length > 0) {
                    this.beginInfos[0] = { x: this.playerArr[0].x, y: this.playerArr[0].y, rotation: 0 };
                }
            }
            Laya.SoundManager.stopSound("sound/laser.mp3");
        }.bind(this));
    };

    __proto.playSkill = function (index, type, time) {
        if (index == 0 && this.isAlive[index] == false) return;
        switch (type) {
            case 0:
                var count = 0;
                var func = function () {
                    if (this.state != "running") {
                        Laya.timer.clear(this, func);
                        return;
                    }

                    this.shoot(5, index);
                    count++;
                    if (count > 2) {
                        Laya.timer.clear(this, func);
                        if (index == 0) this.isPlaySkill = false;
                    }
                }.bind(this);

                func();

                this.isMutiArr[index] = true;
                Laya.timer.loop(200, this, func);
                Laya.timer.once(1000, this, function () {
                    this.isMutiArr[index] = false;
                }.bind(this))
                this.skillArr[0 + 2 * index].startCd(time);
                break;
            case 1:
                if (index == 0) this.isPlayLaser = true;
                this.shootEableArr[index] = false;
                this.playLaser(index);
                if (Global.isMusicOn) Laya.SoundManager.playSound("sound/laser.wav");
                this.skillArr[1 + 2 * index].startCd(time);
                break;
        }
    }
    __proto.robotSkill = function (type) {
        if (!this.isAlive[1]) return;
        if (type == 0) {
            Laya.Tween.clearAll(this.playerArr[1]);
            this.playSkill(1, type, Date.now());
        }
        else if (type == 1) {
            Laya.Tween.clearAll(this.playerArr[1]);
            this.isRobotParsing = true;

            var updateLaser = function () {
                var laser = this.laserArr[1];
                if (laser) {
                    var player = this.playerArr[0];
                    var opp = this.playerArr[1];
                    var d = Utils.getP2LDistance({ x: player.x, y: player.y }, { x: opp.x, y: opp.y }, -opp.rotation + 90, 1);
                    console.log(d);
                    var dt = 0.5;
                    opp.rotation += d > 0 ? dt : -dt;
                    laser.rotation += d > 0 ? dt : -dt;
                }
            }.bind(this);

            Laya.timer.frameLoop(1, this, updateLaser);

            Laya.timer.once(3000, this, function () {
                this.isRobotParsing = false;
                Laya.timer.clear(this, updateLaser);
            }.bind(this))

            this.playSkill(1, type, Date.now());
        }
    }

    __proto.onClick = function (arg) {
        if (this.state != "running") return;
        if (arg.isReady) {
            this.playSkill(0, arg.type, 0);
            this.isPlaySkill = true;

            if (Global.robotType != 1) {
                var location = { x: this.width - this.playerArr[0].x, y: this.height - this.playerArr[0].y };
                var msg = {
                    type: "skill",
                    typeid: arg.type,
                    time: Date.now()
                }

                NetMgr.instance.send('msg', msg);
            }
        }
    };

    __proto.startGame = function (time) {
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        this.headBar.setHead();

        this.addChild(new ReadyBar());

        Laya.timer.once(1000, this, function () {
            for (var i = 0; i < this.skillArr.length; ++i)
                this.skillArr[i].startCd(0);
            this.updateBullet();
            this.timeBar.startTimeDown();
            this.state = "running";
            if (Global.robotType == 1) this.updateRobot();
        });
    };

    __proto.updateRobot = function () {
        var getPos = function (x1, y1) {
            var x = (Math.random() - 0.5) * 2 * 400 + x1;
            var y = (Math.random() - 0.5) * 2 * 400 + y1;
            if (x < 150 || x > 600 || y < 150 || y > 517)
                return getPos(x1, y1);
            var d = Math.sqrt((x - this.playerArr[1].x) * (x - this.playerArr[1].x) + (y - this.playerArr[1].y) * (y - this.playerArr[1].y));
            if (d < 100)
                return getPos(x1, y1);
            return { x: x, y: y, d: d };
        }.bind(this);

        var move = function () {
            if (this.state == "over") return;
            var pos = getPos(this.playerArr[1].x, this.playerArr[1].y);
            var t = 50 + Math.random() * 300;
            t = 100 + Math.random() * 400;
            if (!this.isRobotParsing) {
                Laya.Tween.to(this.playerArr[1], { x: pos.x }, t);
                Laya.Tween.to(this.playerArr[1], { y: pos.y }, t, Laya.Ease.sineInOut);
            }
            var b = Math.random() > 0.7;
            Laya.timer.once(t + (Math.random() > 0.6 ? 0 + Math.random() * 50 : 500 + Math.random() * 1000), this, move);
        }.bind(this)

        move();
    }

    __proto.shoot = function (n, index) {
        if (index == undefined) index = -1;
        if (n == undefined) n = this.bulletCount % 2 == 0 ? 3 : 4;

        function getPos(i, n, x, y, r, d) {
            var angle = n == 3 ? Math.PI * 3 / 8 : Math.PI * 5 / 16;
            if (n == 5) angle = Math.PI / 4;
            var x1 = x + r * Math.cos(angle + Math.PI / 8 * i);
            var y1 = y + d * r * Math.sin(angle + Math.PI / 8 * i);
            return { x: x1, y: y1 };
        }
        for (var i = 0; i < this.playerArr.length; ++i) {
            var player = this.playerArr[i];
            if (this.shootEableArr[i] == false && n != 5) continue;
            else if (this.isAlive[i] == false) continue;
            else if (index != -1 && i != index) continue;
            else if (this.isMutiArr[i] && n != 5) continue;

            for (var j = 0; j < n; ++j) {
                var bullet = new Laya.Sprite();
                bullet.loadImage("texture/game/bullet_" + i + "_0.png");
                bullet.pivot(bullet.width / 2, bullet.height / 2);
                var pos = getPos(j, n, player.x, player.y, 50, i == 0 ? -1 : 1);
                bullet.pos(pos.x, pos.y);
                this.panel.addChild(bullet);

                var pos1 = getPos(j, n, player.x, player.y, 1335, i == 0 ? -1 : 1);
                bullet.rotation += (i * 180);
                Laya.Tween.to(bullet, { x: pos1.x, y: pos1.y }, 2000, );
                this.bulletArr[i].push(bullet);
            }
        }

        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/bullet.mp3");
        this.bulletCount++;
    };
    __proto.hitByBullet = function (hp, idx, i, x, y) {
        this.hpArr[i] = hp - 4;
        this.pgArr[i].value = this.hpArr[i] / 100;
        if (i == 0 && !this.hasBlood && this.hpArr[i] < 20) this.playBlood();

        var anim = new Laya.Animation();
        anim.play(0, false, "hit");
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(x, y);
        anim.zOrder = 200;
        this.panel.addChild(anim);
        Laya.timer.once(200, this, function (anim) {
            anim.removeSelf();
            anim.destroy();
        }.bind(this), [anim]);

        if (this.hpArr[i] <= 0) {
            var player = this.playerArr[i];

            var anim1 = new Laya.Animation();
            anim1.play(0, false, "explode");
            bounds = anim1.getBounds();
            anim1.pivot(bounds.width / 2, bounds.height / 2);
            anim1.pos(player.x, player.y);
            anim1.zOrder = 10000;

            if (this.laserArr[i] != null) this.laserArr[i].removeSelf();

            this.panel.addChild(anim1);
            Laya.timer.once(200, this, function (anim, idx) {
                anim.removeSelf();
                anim.destroy();
                this.oneOver(idx);
            }.bind(this), [anim1, idx]);

            if (Global.isMusicOn) Laya.SoundManager.playSound("sound/explode.mp3");

            player.visible = false;
            this.shootEableArr[i] = false;
            this.isAlive[i] = false;
        }
    }

    var count = 0;
    __proto.hitByLaser = function (hp, idx, i, x, y) {

        this.hpArr[i] = hp - 3;
        this.pgArr[i].value = this.hpArr[i] / 100;

        if (i == 0 && !this.hasBlood && this.hpArr[i] < 20) this.playBlood();

        var anim = new Laya.Animation();
        anim.play(0, false, "hit");
        bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(x, y);
        anim.zOrder = 10000;
        this.panel.addChild(anim);
        Laya.timer.once(200, this, function (idx) {
            anim.removeSelf();
            anim.destroy();
        }, [i]);

        count++;

        if (this.hpArr[i] <= 0) {
            var player = this.playerArr[i];
            var anim1 = new Laya.Animation();
            anim1.play(0, false, "explode");
            bounds = anim.getBounds();
            anim1.pivot(bounds.width / 2, bounds.height / 2);
            anim1.pos(player.x, player.y);
            anim1.zOrder = 10000;
            if (this.laserArr[i] != null) this.laserArr[i].removeSelf();
            this.panel.addChild(anim1);
            Laya.timer.once(200, this, function (anim, idx) {
                anim.removeSelf();
                anim.destroy();
                this.oneOver(idx);
            }.bind(this), [anim1, idx]);

            player.visible = false;
            this.shootEableArr[i] = false;
            this.isAlive[i] = false;
        }
    }

    __proto.updateBullet = function () {
        this.bulletArr = [[], []];
        this.bulletCount = 0;
        Laya.timer.loop(1000, this, this.shoot);

        var frameCall = function () {
            if (this.state != "running") {
                Laya.timer.clear(this, frameCall);
                return;
            }
            for (var i = 0; i < this.playerArr.length; i++) {
                var player = this.playerArr[i];
                var idx = i == 0 ? 1 : 0;
                if (this.isAlive[i] == false) continue;
                for (var j = 0; j < this.bulletArr[idx].length; j++) {
                    var bullet = this.bulletArr[idx][j];
                    if (Utils.isOut(bullet.x, bullet.y, bullet.width / 2, this.width, this.height)) {
                        this.bulletArr[idx].splice(j, 1);
                        bullet.removeSelf();
                        bullet.destroy();
                    }
                    else if (Utils.isHit(player.x, player.y, player.width / 2, bullet.x, bullet.y)) {
                        this.bulletArr[idx].splice(j, 1);
                        bullet.removeSelf();
                        bullet.destroy();
                        // if (Global.robotType == 0) {
                        //     if (i != 1) continue;
                        //     var msg = {
                        //         type: "hit_by_bullet",
                        //         hp: this.hpArr[i], idx: idx, i: i, x: bullet.x, y: bullet.y
                        //     }

                        //     // NetMgr.instance.send('msg', msg);
                        // }
                        this.hitByBullet(this.hpArr[i], idx, i, bullet.x, bullet.y);
                    }
                }
                var laser = this.laserArr[idx];
                if (laser) {
                    var opp = this.playerArr[idx];
                    var d = Utils.getP2LDistance({ x: player.x, y: player.y }, { x: opp.x, y: opp.y }, -opp.rotation + 90, 1);
                    if (!this.isPlayHit[i] && Math.abs(d) < 100) {
                        this.isPlayHit[i] = true;
                        Laya.timer.once(200, this, function (i) {
                            this.isPlayHit[i] = false;
                        }, [i])
                        // if (Global.robotType == 0) {
                        //     if (i != 1) continue;
                        //     var msg = {
                        //         type: "hit_by_laser",
                        //         hp: this.hpArr[i], idx: idx, i: i, x: player.x, y: player.y
                        //     }
                        //     NetMgr.instance.send('msg', msg);
                        // }
                        this.hitByLaser(this.hpArr[i], idx, i, player.x, player.y);
                    }
                }
            }
        }.bind(this);

        Laya.timer.frameLoop(1, this, frameCall);
    };

    __proto.oneOver = function (index) {
        if (this.firstDead) return;
        this.firstDead = true;
        var result = index == 0 ? 1 : 0;
        Laya.timer.clearAll(this.timeBar);
        if (this.timeBar.timeTxt.text == "1") this.timeBar.timeTxt.text = "0";
        Laya.timer.once(2000, this, function () {
            var b = true;
            for (var i = 0; i < 2; ++i) {
                if (this.isAlive[i] == false) {
                }
                else b = false;
            }

            if (b) {
                result = 2;
            }
            this.gameOver(result);
        }.bind(this));
    }

    __proto.gameOver = function (result) {
        if (this.state == "over") return;
        this.state = "over";

        Laya.timer.clearAll(this.timeBar);
        for (var i = 0; i < this.skillArr.length; ++i)
            this.skillArr[i].stopCd();
        Laya.timer.clear(this, this.shoot);
        Laya.timer.clear(this, this.updateBullet);
        Laya.timer.clearAll(this.timeBar);

        Laya.SoundManager.stopAll();

        if (this.timeBar.timeTxt.text == "1") this.timeBar.timeTxt.text = "0";

        this.showLoading();
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