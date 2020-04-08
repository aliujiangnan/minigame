/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.hasTouched = false;
        this.state = "idle";
        this.isMoving = false;
        this.addNum = 0;
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
                    this.move(NetMgr.instance.getOpponent().index, data.loc.row, data.loc.column, data.cloc);
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

        this.playStar();

        var anim = new Laya.Animation();
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(this.width / 2, this.height / 2);
        this.addChild(anim);
        anim.play(0, true, "res/wujian/wujian.ani#");
        anim.interval = 30;

        var headBar = new HeadBar();
        headBar.pos(this.width / 2, 180);
        headBar.zOrder = 10;
        this.addChild(headBar);
        this.headBar = headBar;
    };

    __proto.handFunc = function (hand) {
        hand.graphics.clear();
        hand.graphics.loadImage("texture/game/hand_1.png");
        if (this.handCount % 2 == 0) {
            hand.pos(375, 400);
            Laya.Tween.to(hand, { y: hand.y + 400 }, 1000, null, Laya.Handler.create(this, function () {
                hand.graphics.clear();
                hand.loadImage("texture/game/hand_0.png");
                hand.alpha = 1;
                Laya.timer.once(500, this, this.handFunc, [hand]);
            }));
        }
        else {
            hand.pos(175, 667);
            Laya.Tween.to(hand, { x: hand.x + 400 }, 1000, null, Laya.Handler.create(this, function () {
                hand.graphics.clear();
                hand.loadImage("texture/game/hand_0.png");
                hand.alpha = 1;
                Laya.timer.once(500, this, this.handFunc, [hand]);
            }));
        }

        this.handCount++;
    };

    __proto.displayHand = function () {
        var hand = new Laya.Sprite();
        var hand1 = new Laya.Sprite();
        hand1.loadImage("texture/game/hand_0.png");
        hand1.pivot(hand1.width / 2, hand1.height / 2)
        hand.addChild(hand1);
        hand1.scale(1.3, 1.3);
        hand.zOrder = 100;
        this.addChild(hand);
        hand.name = "handSp";
        this.handCount = 0;
        hand1.pos(375, 400);

        Laya.timer.once(500, this, this.handFunc, [hand1, this]);

    };

    __proto.playStar = function () {
        var posArr = [[93, 291], [550, 80], [571, 1092], [60, 1228]];
        var rotationArr = [0, 0, 0, 45];
        var scaleArr = [1.2, 1, 1, 2];

        for (var i = 0; i < 4; i++) {
            var star = new Laya.Sprite();
            star.loadImage("texture/game/star.png");
            star.pivot(star.width / 2, star.height / 2);
            star.pos(posArr[i][0], posArr[i][1]);
            star.rotation = rotationArr[i];
            star.scale = scaleArr[i];
            this.addChild(star);

            var func = function (star) {
                Laya.Tween.to(star, { alpha: star.alpha == 0 ? 1 : 0 }, 1000 + Math.random() * 1000);
                Laya.timer.once(2000 + Math.random() * 2000, this, func, [star])
            }.bind(this);

            Laya.timer.once(3000 + Math.random() * 3000, this, func, [star]);
        }
    }

    __proto.initPanel = function () {
        var panel = new Laya.Sprite();
        var width = 495, height = 485;
        panel.size(width, height);
        panel.pivot(width / 2, height / 2);
        panel.pos(this.width / 2 + 5, 665);
        this.addChild(panel);
        this.panel = panel;
        for (var i = 0; i < 4; i++) {
            var sp = new Laya.Sprite();
            sp.graphics.drawLine(0, i * this.panel.width / 3, width, i * this.panel.width / 3, "#ffffff");

            var sp1 = new Laya.Sprite();
            sp1.graphics.drawLine(i * this.panel.height / 3, 0, i * this.panel.height / 3, height, "#ffffff");
        }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var sp = new Laya.Sprite();
                sp.size(this.panel.width / 3, this.panel.height / 3)
                sp.pivot(sp.width / 2, sp.height / 2);
                sp.pos(sp.width / 2 + j * this.panel.width / 3, sp.height / 2 + i * this.panel.width / 3)
                this.panel.addChild(sp);
            }
        }

        var sp = new Laya.Sprite();
        sp.size(this.width, this.height * 0.8);
        sp.pivot(sp.width / 2, sp.height / 2);
        sp.pos(this.width / 2, this.height / 2);
        sp.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        sp.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        sp.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.addChild(sp);

        this.typeArr = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ];
    };

    __proto.onMouseDown = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.state != "running") return;
        else if (this.isMoving) return;

        this.hasTouched = true;
        this.beginPos = { x: x, y: y };
    };
    __proto.onMouseMove = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        if (this.hasTouched == false) {
            return;
        }
        else if (this.beginPos == null) {
            return
        };
        var d2 = (x - this.beginPos.x) * (x - this.beginPos.x) + (y - this.beginPos.y) * (y - this.beginPos.y);
        if (d2 < 1600) {
            return
        };

        var hand = this.getChildByName("handSp")
        if (hand != null) {
            hand.removeSelf();
            hand.destroy();
            Laya.timer.clear(this, this.handFunc)
        }

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

        var index = Global.robotType == 0 ? NetMgr.instance.seatIndex : 0;
        var player = this.playerArr[index];
        var row = vec.row + player.row;
        var column = vec.column + player.column;
        if ((row > 2 || row < 0) || (column > 2 || column < 0)) {
            return;
        };

        this.hasTouched = false;
        this.beginPos = null;

        this.move(index, row, column)
        if (Global.robotType != 1) {
            var location = { row: row, column: column };
            var msg = {
                type: "move",
                loc: location,
                cloc: { row: player.row, column: player.column }
            }

            NetMgr.instance.send('msg', msg);
        }
    };

    __proto.onMouseUp = function () {
        var x = Laya.stage.mouseX;
        var y = Laya.stage.mouseY;
        this.hasTouched = false;
        this.beginPos = null;
    };

    __proto.onClick = function (arg) {
        if (Global.robotType == 1)
            this.move(0, arg[0], arg[1]);
        else {
            var location = { row: arg[0], column: arg[1] };
            var msg = {
                type: "move",
                loc: location
            }

            NetMgr.instance.send('msg', msg);
        }
    };

    __proto.move = function (index, row, column, loc) {
        if (this.state != "running") return;
        var player = this.playerArr[index];
        var selfIndex = NetMgr.instance.seatIndex;
        if ((this.typeArr[row][column] == -1)) {

            if (index == selfIndex)
                this.isMoving = true;
            this.typeArr[row][column] = index;
            this.typeArr[player.row][player.column] = -1;
            player.row = row;
            player.column = column;
            Laya.Tween.to(player, {
                x: this.panel.width / 6 + column * this.panel.width / 3,
                y: this.panel.width / 6 + row * this.panel.width / 3
            }, 30, null, Laya.Handler.create(this, function () {
                if (index == selfIndex)
                    this.isMoving = false;
            }))

            player.location(row, column);
        }
        else return;

        if (Global.isMusicOn && selfIndex == index) Laya.SoundManager.playSound("sound/move.wav");
    };

    __proto.initPlayers = function (locations) {
        var getLocation = function () {
            var index = parseInt("" + Utils.seededRandom() * 9);
            var row = parseInt("" + index / 3);
            var column = index % 3;
            if (this.typeArr[row][column] != -1)
                return getLocation();
            return { row: row, column: column };
        }.bind(this)

        this.playerArr = [];
        for (var i = 0; i < 2; i++) {
            var row = locations ? locations[i].row : loc.row;
            var column = locations ? locations[i].column : loc.column;
            this.typeArr[row][column] = i;

            var index = Global.robotType == 0 ? NetMgr.instance.seatIndex : 0;
            var player = new Player(index == i ? 0 : 1);
            player.pos(this.panel.width / 6 + column * this.panel.width / 3 + 0, this.panel.width / 6 + row * this.panel.width / 3 + 0);
            player.location(row, column);
            player.zOrder = 100;
            this.panel.addChild(player);
            this.playerArr[i] = player;
        }
    };

    __proto.startGame = function (locations) {
        if (locations == undefined) locations = [{ row: 0, column: 1 }, { row: 2, column: 1 }]
        var readyBar = new ReadyBar();
        readyBar.zOrder = 100;
        this.addChild(readyBar);

        this.headBar.setHead();
        this.initPanel();

        Laya.timer.once(1500, this, function () {
            this.initPlayers(locations);
            Laya.timer.once(3000, this, this.updateShark)
            this.displayHand();
            this.state = "running";
            if (Global.robotType == 1) {
                Laya.timer.once(1000 + Math.random() * 2000, this, this.updateRobot);
            }
        }.bind(this));

    };

    __proto.updateRobot = function () {
        this.moveAble = true;
        Laya.timer.once(1000 + Math.random() * 2000, this, this.updateRobot);
    }

    __proto.updateShark = function () {
        this.sharkArr = [];

        var direction = parseInt("" + Utils.seededRandom() * 4);
        this.addShark(direction);

        var sp = new Laya.Sprite();
        sp.graphics.drawRect(0, 0, 10, 10, "#ff0000");
        sp.zOrder = 100;
        var index = Global.robotType == 1 ? 0 : NetMgr.instance.seatIndex;
        Laya.timer.frameLoop(1, this, function () {
            var safe = true;
            if (Global.robotType == 1) {
                for (var i = 0; i < this.sharkArr.length; i++) {
                    var shark = this.sharkArr[i];
                    var player = this.playerArr[1];
                    var orgin = shark.getRectOrign();
                    if (Utils.isCollsion(orgin.x, orgin.y, shark.width * 1, shark.height * 1, player.x, player.y, this.panel.width / 3, this.panel.height / 3)) {
                        safe = false;
                        break;
                    }
                }
            }

            for (var i = 0; i < this.sharkArr.length; i++) {
                var shark = this.sharkArr[i];
                for (var j = 0; j < this.playerArr.length; j++) {
                    var player = this.playerArr[j];
                    var orgin = shark.getRectOrign();
                    sp.pos(orgin.x, orgin.y);
                    if (Global.robotType == 1 && j == 1) {
                        if (Utils.isCollsion(orgin.x, orgin.y, shark.width * 0.9, shark.height * 0.9, player.x, player.y, this.panel.width / 3, this.panel.height / 3)) {
                            this.moveToSafe(player, orgin, shark.direction);
                        }
                        else if (safe && this.moveAble) {
                            this.moveToSafe(player, orgin, shark.direction);
                            this.moveAble = false;
                        }
                    }
                    if (Utils.isCollsion(orgin.x, orgin.y, shark.rectWidth, shark.rectHeight, player.x, player.y, player.width, player.height)) {
                        shark.playEat();
                        player.playSpray();

                        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/eat.wav");
                        return this.gameOver(j == index ? 0 : 1);
                    }
                }
            }
        }.bind(this));
    };

    __proto.moveToSafe = function (player, sharkPos, direction) {
        if (this.hasMove) return;
        this.hasMove = true;

        Laya.timer.once(50 + Math.random() * 100, this, function () {
            this.hasMove = false;
        })
        var w = sharkPos.x / (this.panel.width / 3);
        var h = sharkPos.y / (this.panel.height / 3);
        var row = h < 0 ? -1 : parseInt(h);
        var column = w < 0 ? -1 : parseInt(w);
        var locations = [
            { row: player.row - 1, column: player.column },
            { row: player.row + 1, column: player.column },
            { row: player.row, column: player.column - 1 },
            { row: player.row, column: player.column + 1 },
        ]

        var user = this.playerArr[0];
        var firstArr = [];
        var secondArr = [];
        for (var i = 0; i < locations.length; i++) {
            if ((locations[i].row > 2 || locations[i].row < 0) || (locations[i].column > 2 || locations[i].column < 0))
                continue;
            else if (locations[i].row == user.row && locations[i].column == user.column)
                continue;
            else if (locations[i].row != row || locations[i].column != column) {
                if ((direction == 0 || direction == 2) && locations[i].row == row)
                    secondArr.push(locations[i]);
                else if ((direction == 1 || direction == 3) && locations[i].column == column)
                    secondArr.push(locations[i]);
                else
                    firstArr.push(locations[i]);
            }
        }

        if (firstArr.length > 0) {
            var n = parseInt(Math.random() * firstArr.length);
            this.move(1, firstArr[n].row, firstArr[n].column);
        }
        else if (secondArr.length > 0) {
            var n = parseInt(Math.random() * secondArr.length);
            this.move(1, secondArr[n].row, secondArr[n].column);
        }

    };

    __proto.addShark = function (direction) {
        var getRandPos = function (direction, shark) {
            var row, column, x, y, x1, y1;
            var offsetX = (this.width - this.panel.width) / 2;
            var offsetY = (this.height - this.panel.height) / 2;
            if (direction == 0) {
                row = parseInt("" + Utils.seededRandom() * 3);
                x = -offsetX - shark.width / 2 + 50;
                y = this.panel.height / 6 + row * this.panel.width / 3;
                x1 = this.width - offsetX + shark.width / 2 + 50;
                y1 = y;
            }
            else if (direction == 2) {
                row = parseInt("" + Utils.seededRandom() * 3);
                x = this.width - offsetX + shark.width / 2 + 50;
                y = this.panel.height / 6 + row * this.panel.width / 3;
                x1 = -offsetX - shark.width / 2 + 50;
                y1 = y;
            }
            else if (direction == 1) {
                column = parseInt("" + Utils.seededRandom() * 3);
                x = this.panel.width / 6 + column * this.panel.width / 3;
                y = -offsetY - shark.height / 2 - 50;
                x1 = x;
                y1 = this.height - offsetY + shark.height / 2 - 50;
            }
            else if (direction == 3) {
                column = parseInt("" + Utils.seededRandom() * 3);
                x = this.panel.width / 6 + column * this.panel.width / 3;
                y = this.height - offsetY + shark.height / 2 - 50;
                x1 = x;
                y1 = -offsetY - shark.height / 2 - 50;
            }
            return { x: x, y: y, x1: x1, y1: y1 };
        }.bind(this);

        var shark = new Shark(direction);
        var pos = getRandPos(direction, shark);

        var moveTime = 5000;
        var addTime = Math.max(1500, 3000 - parseInt(this.addNum / 2) * 500);

        this.panel.addChild(shark);
        this.sharkArr.push(shark);
        this.addNum++;
        var duration = direction == 1 || direction == 3 ? moveTime * (1 + (1 - this.width / this.height)) : moveTime;
        shark.pos(pos.x, pos.y);
        Laya.Tween.to(shark, { x: pos.x1, y: pos.y1 }, duration, null, Laya.Handler.create(this, function () {
            var index = this.sharkArr.indexOf(shark);
            this.sharkArr.splice(index, 1);
            shark.removeSelf();
        }));

        direction = parseInt("" + Utils.seededRandom() * 4);
        Laya.timer.once(addTime, this, this.addShark, [direction]);
    };

    __proto.gameOver = function (result) {
        if (this.state == "over")
            return;

        this.state = "over";
        this.exitBtn.mouseEnabled = false;


        Laya.timer.once(200, this, function () {
            this.showLoading();
            Laya.timer.clearAll(this);
            if (Global.testType == 0)
                this.showOver(result);
            else
                NetMgr.instance.send('gameover', { 'rst': result });
        }.bind(this))
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