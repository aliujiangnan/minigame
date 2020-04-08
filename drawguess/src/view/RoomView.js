/**
* RoomView 
*/
var RoomView = (function (_super) {
    function RoomView() {
        RoomView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.hasReady = false;
        this.initSelf();
    }

    Laya.class(RoomView, "RoomView", _super);

    var __proto = RoomView.prototype;
    __proto.initSelf = function () {
        this.initListeners();

        var bg = new Laya.Sprite();
        bg.zOrder = 0;
        bg.loadImage("res/ready/bg.png");
        this.addChild(bg);

        var title = new Laya.Sprite();
        title.loadImage("res/ready/bg_title.png");
        title.pivot(title.width / 2, title.height / 2);
        title.pos(this.width / 2, 50);
        title.zOrder = 100;
        title.visible = false;
        this.addChild(title);
        this.title = title;

        var txt = new Laya.Text();
        txt.fontSize = 32;
        txt.color = "#ffffff";
        txt.text = "prepararing";
        txt.width = 500;
        txt.strokeColor = "#ffffff";
        txt.pivotX = 250;
        txt.align = "center";
        txt.scaleY = 1.2;
        txt.zOrder = 100;
        txt.pos(title.width / 2, title.y - 40);
        this.title.addChild(txt);
        this.tipTxt = txt;

        var panel = new Laya.Sprite();
        panel.loadImage("res/ready/panel.png");
        panel.pivot(panel.width / 2, panel.height / 2);
        panel.pos(this.width / 2 + 5, 460);
        this.addChild(panel);

        this.posArr = [
            { x: 185, y: 415 },
            { x: 280, y: 331 },
            { x: 410, y: 291 },
            { x: 543, y: 346 },
            { x: 589, y: 463 },
            { x: 520, y: 565 },
        ];

        this.headArr = new Array(6);

        for (var i = 0; i < 6; ++i) {
            var btn = new Laya.Button("res/ready/tx_" + (i + 1) + ".png");
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.scale(Global.scaleX, Global.scaleY);
            btn.pos(this.posArr[i].x, this.posArr[i].y);
            btn.clickHandler = Laya.Handler.create(this, function (index) {
                if (!NetMgr.instance.isPlayer) {
                    NetMgr.instance.send('sitdown');
                }
                else if (NetMgr.instance.isCreator() && NetMgr.instance.getSeat(index).online) {
                    var kickBar = new KickBar(1, index);
                    kickBar.pos(this.width / 2, this.height / 2);
                    kickBar.zOrder = 100;
                    this.addChild(kickBar);
                }
            }.bind(this), [i], false)
            this.addChild(btn);
        }

        var playerBtns = [];
        this.topBtns = [];
        for (var i = 0; i < 4; ++i) {
            var btn = new Laya.Button("res/ready/btn_" + (i + 1) + ".png");
            btn.anchorX = 0.5;
            if (i < 2) {
                btn.anchorY = 0.5;
                btn.stateNum = 2;
                btn.pos(this.width * 0.5, this.height * 0.57);
                playerBtns.push(btn);
            }
            else {
                btn.zOrder = 100;
                btn.stateNum = 1;
                btn.pos(this.width * (0.85 + (i - 2) * 0.12) - 37, 0);

                if (i == 2) {
                    var txt = new Laya.Text();
                    txt.color = "#ffffff";
                    txt.font = "fnt_obs";
                    txt.text = NetMgr.instance.isPlayer ? "" : NetMgr.instance.getObsNum();
                    txt.width = 50;
                    txt.pivotX = 25;
                    txt.align = "center";
                    txt.pos(63, 35);
                    btn.addChild(txt);
                    this.obsTxt = txt;
                }
                this.topBtns.push(btn);
            }
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [i, btn], false)
            btn.visible = false;
            this.addChild(btn);
        }

        this.btnInvite = playerBtns[0];
        this.btnReady = playerBtns[1];
        this.btnInvite.visible = true;
        this.btnInvite.scale(1.2, 1.2);

        var box = new Laya.Sprite();
        box.loadImage("res/ready/box_1.png");
        box.pivot(box.width / 2, box.height / 2);
        box.pos(this.width / 2 - 3, this.height * 0.794);
        this.addChild(box);

        var box1 = new Laya.Sprite();
        box1.loadImage("res/ready/box_2.png");
        box1.pivot(box1.width / 2, box1.height / 2);
        box1.pos(this.width / 2, this.height - box1.height / 2);
        box1.zOrder = 100;
        this.addChild(box1);

        var box2 = new Laya.Sprite();
        box2.loadImage("res/ready/box_3.png");
        box2.pivot(box2.width / 2, box2.height / 2);
        box2.pos(box1.x, box1.y);
        box2.zOrder = 100;
        this.addChild(box2);

        var speak = new Laya.Sprite();
        speak.loadImage("res/ready/speak.png");
        speak.pivot(speak.width / 2, speak.height / 2);
        speak.pos(box2.x, box2.y + 3);
        speak.scaleX -= 0.02;
        speak.zOrder = 100;
        this.addChild(speak);
        this.speak = speak;
        this.speakAble = true;
        this.speak.visible = !this.speakAble;
        var resArr = ["voice", "send"]
        for (var i = 0; i < 2; ++i) {
            var btn = new Laya.Button("res/ready/btn_" + resArr[i] + ".png");
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.zOrder = 100;
            btn.pos(this.width * (0.08 + i * 0.84), box1.y);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [4 + i], false);
            this.addChild(btn);
        }

        // this.msgArr = [];

        var chatCnt = new ChatCnt(665, 321);
        chatCnt.pos(box.x + 4, box.y - 4);
        this.addChild(chatCnt);
        this.chatCnt = chatCnt;

        this.msgStr = "";
        var txtIn = new Laya.TextInput("");
        txtIn.fontSize = 36;
        txtIn.color = "#000000";
        txtIn.size(485, 45);
        txtIn.pivotX = 485 / 2;
        txtIn.pos(Laya.stage.width * 0.5, Laya.stage.height - 67, 5);
        this.txtIn = txtIn;
        this.addChild(txtIn);
        txtIn.zOrder = 100;
        txtIn.on(Laya.Event.INPUT, this, function () {
            this.msgStr = txtIn.text;
        }.bind(this));

        var timeBar = new TimeBar(60);
        timeBar.pos(this.width * 0.2, 50);
        timeBar.zOrder = 300;
        this.addChild(timeBar);
        this.timeBar = timeBar;
        this.timeBar.visible = false;
        this.state = "idle";

        var observer = new ObserverBar();
        observer.name = "observerBar";
        observer.zOrder = 1000;
        observer.visible = false;
        this.observerBar = observer;
        this.addChild(observer);

        var ruleBar = new RuleBar();
        ruleBar.name = "ruleBar";
        ruleBar.pos(375, 667)
        ruleBar.zOrder = 1000;
        ruleBar.visible = false;
        this.ruleBar = ruleBar;
        this.addChild(ruleBar);

        this.chatCnt.addMsg("System:" + "Welcome " + UserMgr.instance.nickName + " to enter the hall.");
    };

    __proto.btnFunc = function (index, btn) {
        if (index < 5 && this.gameView)
            this.gameView.drawView.drawCanvas();
        switch (index) {
            case 0:
                NetMgr.instance.send('invite');
                break;
            case 1:
                NetMgr.instance.send('ready');
                // NetMgr.instance.send(this.hasReady ? 'cancel' : 'ready');
                break;
            case 2:
                if (this.observerBar.visible) {
                    btn.skin = "res/ready/btn_3.png";
                    this.observerBar.visible = false;
                }
                else {
                    this.observerBar.showSelf();
                    btn.skin = "res/ready/btn_6.png";
                }

                break;
            case 3:
                if (this.ruleBar.visible) {
                    btn.skin = "res/ready/btn_4.png";
                    this.ruleBar.visible = false;
                }
                else {
                    this.ruleBar.showSelf();
                    btn.skin = "res/ready/btn_7.png";
                }

                break;
            case 4:
                var view = new ResultView([]);
                view.pos(375, 667);
                view.zOrder = 1000;
                this.addChild(view);

                break;
            case 5:
                if (this.txtIn.text.length > 0 && this.txtIn.text[0] == '/') {
                    NetMgr.instance.send(this.txtIn.text.substring(1, this.txtIn.text.length), '');
                    this.txtIn.text = "";
                    return;
                }
                else if (this.msgStr == "") return;
                else if (!NetMgr.instance.isPlayer && NetMgr.instance.roomId == null) return;
                else if (this.gameView && NetMgr.instance.isPainter()) return;

                NetMgr.instance.send(this.gameView == null ? 'chat' : 'commit', { str: this.msgStr });
                this.msgStr = "";
                this.txtIn.text = "";
                break;
        }
    };

    __proto.initListeners = function () {
        this.listeners = [];

        var addHandler = function (e, h) {
            this.listeners.push({ e: e, h: h });
            EventHelper.instance.on(e, this, h)
        }.bind(this)

        addHandler("enter_room", this.showOther);

        addHandler("invite", this.showInviteMsg);

        addHandler("chat", this.showChatMsg);

        addHandler("new_user", this.showNewUserMsg);

        addHandler("all_ready", this.startEnterTimeDown);

        addHandler("game_begin", this.startGame);

        addHandler("draw_begin", this.startDraw);

        addHandler("player_select", this.showSelect);

        addHandler("show_answer", this.showAnswer);

        addHandler("commit_result", this.showCommitMsg);

        addHandler("answer_result", this.showAnswerMsg);

        addHandler("user_ready", this.showReady);

        addHandler("change_seat", this.refreshSeatByChange);

        addHandler("user_state_changed", this.refreshSeatByState);

        addHandler("cancel_ready", this.cancelReady);

        addHandler("kick_player", this.showKick);

        addHandler("cmd_tool", this.selectTool);

        addHandler("cmd_shape", this.drawShape);

        addHandler("game_over", this.gameOver);

        addHandler("exit_room", this.exitRoom);
    };

    __proto.exitRoom = function () {
        var chatCnt = new ChatCnt(665, 321);
        chatCnt.pos(this.chatCnt.x, this.chatCnt.y);
        this.addChild(chatCnt);
        this.chatCnt.removeSelf();
        this.chatCnt.destroy();
        this.chatCnt = chatCnt;
        this.obsTxt.text = "";
        this.timeBar.visible = false;
        this.title.visible = false;

        this.refreshUser();
        this.observerBar.refreshUser();

        this.btnInvite.visible = true;
        this.btnReady.visible = false;
        this.btnInvite.pos(this.width * 0.5, this.height * 0.57);
        this.btnInvite.scale(1.2, 1.2);
        for (var i = 0; i < this.topBtns.length; ++i) {
            this.topBtns[i].visible = false;
        }
    };

    __proto.showOther = function (info) {
        var chatCnt = new ChatCnt(665, 321);
        chatCnt.pos(this.chatCnt.x, this.chatCnt.y);
        this.addChild(chatCnt);
        this.chatCnt.removeSelf();
        this.chatCnt.destroy();
        this.chatCnt = chatCnt;
        this.chatCnt.addMsg("System:" + "Welcome " + UserMgr.instance.nickName + " to enter the room.");
        this.observerBar.refreshUser();
        var n = NetMgr.instance.getObsNum();
        this.obsTxt.text = "" + (n == 0 ? "" : n);

        this.timeBar.visible = true;
        this.title.visible = true;

        if (info == null || info == "") {
            var j = 0;
            for (var i = 0; i < NetMgr.instance.getPlayerNum(); ++i) {
                var seat = NetMgr.instance.getSeat(i);
                if (seat.online && seat.isPlayer) {
                    var head = new Head(seat.nickName, seat.sex, seat.avatar);
                    head.scaleX *= 0.85;
                    head.scaleY *= 0.85;
                    head.pos(this.posArr[j].x, this.posArr[j].y - 4);
                    if (seat.ready) head.showReady();
                    this.addChild(head);
                    this.headArr[j] = head;
                    if (i == NetMgr.instance.seatIndex) {
                        head.nameTxt.color = "#ff0000";
                        head.nameTxt.strokeColor = "#ff0000";
                    }
                    if (seat.ready)
                        head.showReady();
                    j++;
                }
            }

            for (var i = 0; i < this.topBtns.length; ++i) {
                this.topBtns[i].visible = true;
            }

            this.btnReady.visible = true;
            this.btnReady.visible = NetMgr.instance.isCreator() ? this.width * 0.48 : this.width * 0.5;
            this.btnInvite.pos(this.width * 0.48 + 260, this.height * 0.57 + 8);
            this.btnInvite.scale(1, 1);
            this.btnInvite.visible = NetMgr.instance.isCreator();
        }
        else {
            this.gameView = new GameView();
            this.gameView.zOrder = 50;
            this.addChild(this.gameView);
            var chatCnt = new ChatCnt(750, 200);
            chatCnt.pos(this.chatCnt.x, this.chatCnt.y + 43 + 50);
            this.gameView.addChild(chatCnt);
            chatCnt.zOrder = 100;
            this.gameView.chatCnt = chatCnt;

            // for (var i = 0; i < this.msgArr.length; ++i)
            //     this.gameView.chatCnt.addMsg(this.msgArr[i]);
            createTouch();

            if (info.state == "drawing") {
                for (var i = 0; i < info.cmds.length; ++i) {
                    if (info.cmds[i].type == "sel_col") {
                        Global.colorIndex = info.cmds[i].idx;
                        Painter.ctx.strokeStyle = Global.colorList[Global.colorIndex];//画笔颜色
                        Painter.ctx.fillStyle = Global.colorList[Global.colorIndex];
                    }
                    else if (info.cmds[i].type == "sel_wid") {
                        Global.widthIndex = info.cmds[i].idx;
                        Painter.ctx.lineWidth = Global.widthList[Global.widthIndex];//画笔粗细
                    }
                    else if (info.cmds[i].type == "draw")
                        this.gameView.drawView.onDraw(info.cmds[i].data);
                }

                Laya.timer.clearAll(this.timeBar);
                this.timeBar.startTimeDown(info.t * 1000);

                this.gameView.setDescription(info.word);
                this.tipTxt.text = info.tip;
            }
            else if (info.state == "selecting") {
                Painter.container.style.display = "none";

                var selectBar = new SelectBar();
                selectBar.pos(this.width / 2, this.height * 0.35);
                selectBar.name = "selectBar";
                selectBar.zOrder = 100;
                this.addChild(selectBar);
                Laya.timer.clearAll(this.timeBar);
                this.state = "selecting";
                var num = 5 - Math.floor((Date.now() + Global.timeOffset - info.t * 1000) / 1000);
                this.timeBar.timeTxt.text = "0" + num;

                var func = function () {
                    if (--num < 0 || this.state != "selecting") {
                        Laya.timer.clearAll(this.timeBar);
                        return;
                    }
                    this.timeBar.timeTxt.text = "0" + num;
                }.bind(this);
                Laya.timer.loop(1000, this.timeBar, func);
            }
            else if (info.state == "showing") {
                for (var i = 0; i < info.cmds.length; ++i) {
                    if (info.cmds[i].type == "sel_col") {
                        Global.colorIndex = info.cmds[i].idx;
                        Painter.ctx.strokeStyle = Global.colorList[Global.colorIndex];//画笔颜色
                        Painter.ctx.fillStyle = Global.colorList[Global.colorIndex];
                    }
                    else if (info.cmds[i].type == "sel_wid") {
                        Global.widthIndex = info.cmds[i].idx;
                        Painter.ctx.lineWidth = Global.widthList[Global.widthIndex];//画笔粗细
                    }
                    else if (info.cmds[i].type == "draw")
                        this.gameView.drawView.onDraw(info.cmds[i].data);
                }

                this.gameView.drawView.drawCanvas();
                var view = new AnswerView(this.gameView.drawView.canvaSrc, this.curWord);
                view.name = "answerView";
                view.pos(375, 667)
                view.zOrder = 1000;
                this.addChild(view);

                Laya.timer.clearAll(this.timeBar);
                var num = 5 - Math.floor((Date.now() + Global.timeOffset - info.t * 1000) / 1000);
                this.timeBar.timeTxt.text = "0" + num;

                var func = function () {
                    if (--num < 0) {
                        Laya.timer.clearAll(this.timeBar);
                        return;
                    }
                    this.timeBar.timeTxt.text = "0" + num;
                }.bind(this)
                Laya.timer.loop(1000, this.timeBar, func);
            }
            else if (info.state == "over") {
                this.timeBar.timeTxt.text = "--";
                this.state = "idle";
                // this.msgArr = [];
                Painter.container.style.display = "none";
                var view = new ResultView(info.rsts);
                view.pos(375, 667);
                view.zOrder = 1000;
                this.addChild(view);

                Laya.timer.once(5000 - (Date.now() + Global.timeOffset - info.t * 1000), this, function () {
                    view.removeSelf();
                    view.destroy();
                    this.gameView.removeSelf();
                    this.gameView.destroy();
                    for (var i = 0; i < this.headArr.length; ++i) {
                        this.headArr[i].removeChildByName("ready");
                    }
                }.bind(this))
            }
        }
    }

    __proto.startGame = function (data) {
        this.gameView = new GameView();
        this.gameView.zOrder = 50;
        this.addChild(this.gameView);

        var chatCnt = new ChatCnt(750, 200);
        chatCnt.pos(this.chatCnt.x, this.chatCnt.y + 43 + 50);
        this.gameView.addChild(chatCnt);
        chatCnt.zOrder = 100;
        this.gameView.chatCnt = chatCnt;

        for (var i = 0; i < this.topBtns.length; ++i) {
            this.topBtns[i].visible = false;
        }

        // for (var i = 0; i < this.msgArr.length; ++i)
        //     this.gameView.chatCnt.addMsg(this.msgArr[i]);
        Global.seed = data.seed;
    };

    __proto.showReady = function (data) {
        if (data.userId == UserMgr.instance.userId) this.hasReady = true;
        this.btnReady.skin = this.hasReady ? "res/ready/btn_5.png" : "res/ready/btn_2.png";
        this.headArr[data.index].showReady();
    };

    __proto.cancelReady = function (data) {
        if (data.userId == UserMgr.instance.userId) this.hasReady = false;
        this.btnReady.skin = this.hasReady ? "res/ready/btn_5.png" : "res/ready/btn_2.png";
        this.headArr[data.index].removeChildByName("ready");
        this.state = "idle";
        Laya.timer.clearAll(this.timeBar);
        this.timeBar.timeTxt.text = "--";
    };

    __proto.showKick = function (data) {
        var view = new KickBar(0);
        view.pos(this.width / 2, this.height / 2);
        view.zOrder = 100;
        this.addChild(view);
    };

    __proto.showInviteMsg = function (data) {
        if (data.id != UserMgr.instance.userId && NetMgr.instance.roomId != null) return;

        var str = data.n + ":I create a new game, click here to join!";
        // this.msgArr.push(str);
        var callback = null;
        if (data.id != UserMgr.instance.userId) {
            callback = function () {
                if (NetMgr.instance.roomId == null) NetMgr.instance.send('enter', { id: data.team });
            }
        }
        this.chatCnt.addMsg(str, false, callback);
    };

    __proto.showChatMsg = function (data) {
        var seat = NetMgr.instance.getSeatById(data.id);
        var str = seat.nickName + ":" + data.str;
        // this.msgArr.push(str);
        this.chatCnt.addMsg(str, data.str);
        if (this.gameView) this.gameView.chatCnt.addMsg(str);
    };

    __proto.showNewUserMsg = function (data) {
        this.chatCnt.addMsg("System:Welcome " + data.nickName + " to enter the room.");
        if (this.gameView) this.gameView.chatCnt.addMsg("System:Welcome " + data.nickName + " to enter the room.");
        if (data.isPlayer) {
            // this.state = "idle";
            // Laya.timer.clearAll(this.timeBar);
            // this.timeBar.timeTxt.text = "--";
            var head = new Head(data.nickName, data.sex, data.avatar);
            head.scaleX *= 0.85;
            head.scaleY *= 0.85;
            head.pos(this.posArr[data.index].x, this.posArr[data.index].y - 4);
            this.addChild(head);
            this.headArr[data.index] = head;
        }
        else
            this.obsTxt.text = "" + (NetMgr.instance.getObsNum());
    };

    __proto.startEnterTimeDown = function (data) {
        this.state = "ready";
        Laya.timer.clearAll(this.timeBar);

        this.chatCnt.addMsg("System:" + (NetMgr.instance.isFullReady() ? "Players have been prepared to immediately start the game." : "Wait a little longer, if no one comes, we will start the game."));
        var num = 5;
        this.timeBar.timeTxt.text = "0" + num;
        var func = function () {
            if (--num < 0) {
                Laya.timer.clearAll(this.timeBar);
                return;
            }
            this.timeBar.timeTxt.text = "0" + num;
        }.bind(this)
        Laya.timer.loop(1000, this.timeBar, func)
    };

    __proto.startDraw = function (data) {
        this.state = "draw";
        this.timeBar.reset();
        Laya.timer.clearAll(this.timeBar);
        this.timeBar.startTimeDown(data.time * 1000);
        this.gameView.drawView.clearCanvas();
        this.removeChildByName("selectView");
        this.removeChildByName("selectBar");
        this.curWord = data.word;
        if (NetMgr.instance.isPainter()) {
            this.gameView.setDescription("");
            this.tipTxt.text = data.word;

            createTouch();
            Painter.ctx.lineWidth = 8;//画笔粗细
            Painter.ctx.strokeStyle = "#000000";//画笔颜色
            Painter.ctx.fillStyle = "#000000";
        }
        else {
            this.gameView.setDescription(data.word);
            this.tipTxt.text = data.tip;
            closeTouch();
            Painter.ctx.lineWidth = 8;//画笔粗细
            Painter.ctx.strokeStyle = "#000000";//画笔颜色
            Painter.ctx.fillStyle = "#000000";
        }
    };

    __proto.selectTool = function (data) {
        if (data.type == "sel_col") {
            Global.colorIndex = data.idx;
            Painter.ctx.strokeStyle = Global.colorList[Global.colorIndex];//画笔颜色
            Painter.ctx.fillStyle = Global.colorList[Global.colorIndex];
        }
        else if (data.type == "sel_wid") {
            Global.widthIndex = data.idx;
            Painter.ctx.lineWidth = Global.widthList[Global.widthIndex];//画笔粗细
        }
    };

    __proto.drawShape = function (data) {
        this.gameView.drawView.onDraw(data);
    };

    __proto.showSelect = function (data) {
        this.removeChildByName("selectView");
        this.removeChildByName("selectBar");
        this.removeChildByName("answerView");
        clearCanvas();
        this.gameView.updateBtnVisible();
        this.gameView.drawView.panel.graphics.clear();
        if (data.quick) this.gameView.chatCnt.addMsg("System:The painter didn't choose the words and this round ends.");
        Laya.timer.clearAll(this.gameView.lineTxt);
        Painter.container.style.display = "none";
        this.speakAble = !NetMgr.instance.isPainter();
        this.speak.visible = !this.speakAble;
        this.txtIn.visible = this.speakAble;
        for (var i = 0; i < NetMgr.instance.getPlayerNum(); ++i) {
            var seat = NetMgr.instance.getSeat(i);
            if (seat.isPlayer && seat.online) {
                this.gameView.headArr[i].bg.graphics.clear();
                if (i == NetMgr.instance.painterIndex) {
                    this.gameView.headArr[i].bg.loadImage("res/draw/bg_head_1.png");
                    this.gameView.headArr[i].draw.visible = true;
                }
                else {
                    this.gameView.headArr[i].bg.loadImage("res/draw/bg_head_2.png");
                    this.gameView.headArr[i].draw.visible = false;
                }
                this.gameView.headArr[i].hiddenAdd();
            }
        }

        if (NetMgr.instance.isPainter()) {
            var selectView = new SelectView(data.words);
            selectView.name = "selectView";
            selectView.pos(this.width / 2, this.height / 2);
            this.addChild(selectView);
            selectView.zOrder = 100;
        }
        else {
            var selectBar = new SelectBar();
            selectBar.pos(this.width / 2, this.height * 0.35);
            selectBar.name = "selectBar";
            this.addChild(selectBar);
            selectBar.zOrder = 100;
        }
        Laya.timer.clearAll(this.timeBar);
        this.state = "selecting";
        var num = 5;
        this.timeBar.timeTxt.text = "0" + num;
        var func = function () {
            if (--num < 0 || this.state != "selecting") {
                Laya.timer.clearAll(this.timeBar);
                return;
            }
            this.timeBar.timeTxt.text = "0" + num;
        }.bind(this)
        Laya.timer.loop(1000, this.timeBar, func)
    };

    __proto.showAnswer = function (data) {
        Laya.timer.clearAll(this.gameView.lineTxt);
        this.gameView.drawView.drawCanvas();
        var view = new AnswerView(this.gameView.drawView.canvaSrc, this.curWord);
        view.name = "answerView";
        view.pos(375, 667)
        view.zOrder = 1000;
        this.addChild(view);

        Laya.timer.clearAll(this.timeBar);
        var num = 5;
        this.timeBar.timeTxt.text = "0" + num;
        var func = function () {
            if (--num < 0) {
                Laya.timer.clearAll(this.timeBar);
                return;
            }
            this.timeBar.timeTxt.text = "0" + num;
        }.bind(this)
        Laya.timer.loop(1000, this.timeBar, func);
    };

    __proto.showCommitMsg = function (data) {
        var seat = NetMgr.instance.getSeatById(data.id);
        var hit = data.score > 0;
        var str = seat.nickName + ":" + (data.id != UserMgr.instance.userId ? "***" : data.answer);
        str = hit ? "System:" + seat.nickName + " hit!" : str;
        // this.msgArr.push(str);
        this.chatCnt.addMsg(str, hit);
        if (this.gameView) this.gameView.chatCnt.addMsg(str, hit);

        if (hit) {
            this.gameView.headArr[seat.index].showAdd(data.score, false);
            this.gameView.headArr[seat.index].totalTxt.text = "" + data.score;
        }
    };

    __proto.showAnswerMsg = function (data) {
        if (data.point != 0) {
            this.gameView.headArr[NetMgr.instance.painterIndex].showAdd(data.point, true);
            this.gameView.headArr[NetMgr.instance.painterIndex].totalTxt.text = "" + data.score;
        }
        var painter = NetMgr.instance.getPainter();
        var str = data.num >= 5 ? "The answer is " + data.answer + ".Everyone guessed the answer, " + painter.nickName + " does not add points." : "The answer is " + data.answer + "." + data.num + " people guessed the answer, " + painter.nickName + " added " + data.point + " points.";
        this.chatCnt.addMsg("System:" + str);
        if (this.gameView) this.gameView.chatCnt.addMsg("System:" + str);
    };

    __proto.refreshSeatByChange = function (data) {
        this.refreshUser();
        this.observerBar.refreshUser();

        if (this.gameView) {
            this.gameView.updateBtnVisible();
            this.gameView.refreshUser();
        }
        var n = NetMgr.instance.getObsNum();
        this.obsTxt.text = "" + (n == 0 ? "" : n);
        this.btnReady.visible = NetMgr.instance.isPlayer;
        this.btnInvite.visible = NetMgr.instance.isCreator();

    };

    __proto.refreshSeatByState = function (data) {
        if (this.gameView && !data.online) {
            this.chatCnt.addMsg("System:" + data.nickName + " is offline. If you offline during the game, you will lost score on rank list.");
            this.gameView.chatCnt.addMsg("System:" + data.nickName + " is offline. If you offline during the game, you will lost score on rank list.");
        }
        else {
            this.refreshUser();
            if (data.online) {
                this.chatCnt.addMsg("System:" + "Welcome " + data.nickName + " to enter the room.");
                if (this.gameView) this.gameView.chatCnt.addMsg("System:" + "Welcome " + data.nickName + " to enter the room.");
            }
            else {
                this.chatCnt.addMsg("System:" + data.nickName + " left the room.");
            }
            if (!data.isPlayer) {
                this.observerBar.refreshUser();

                var n = NetMgr.instance.getObsNum();
                this.obsTxt.text = "" + (n == 0 ? "" : n);
            }
        }
    };

    __proto.gameOver = function (data) {
        this.hasReady = false;
        this.btnReady.skin = this.hasReady ? "res/ready/btn_5.png" : "res/ready/btn_2.png";
        this.removeChildByName("answerView");
        this.removeChildByName("selectView");
        this.removeChildByName("selectBar");
        Laya.timer.clearAll(this.timeBar);
        Laya.timer.clearAll(this.gameView.lineTxt);
        this.timeBar.timeTxt.text = "--";
        this.state = "idle";
        this.hasReady = false;
        // this.msgArr = [];
        Painter.container.style.display = "none";
        var view = new ResultView(data.rsts);
        view.pos(375, 667);
        view.zOrder = 1000;
        this.addChild(view);

        var chatCnt = new ChatCnt(665, 321);
        chatCnt.pos(this.chatCnt.x, this.chatCnt.y);
        this.addChild(chatCnt);
        this.chatCnt.removeSelf();
        this.chatCnt.destroy();
        this.chatCnt = chatCnt;
        Laya.timer.once(5000, this, function () {
            view.removeSelf();
            view.destroy();
            this.gameView.removeSelf();
            this.gameView.destroy();
            this.gameView = null;
            this.speakAble = true;
            this.speak.visible = !this.speakAble;
            this.txtIn.visible = this.speakAble;
            this.tipTxt.text = "prepararing";
            for (var i = 0; i < this.headArr.length; ++i) {
                if (this.headArr[i] == undefined) continue;
                this.headArr[i].removeChildByName("ready");
            }

            this.refreshUser();
            this.observerBar.refreshUser();

            var n = NetMgr.instance.getObsNum();
            this.obsTxt.text = "" + (n == 0 ? "" : n);
            this.btnReady.visible = NetMgr.instance.isPlayer;
            this.btnInvite.visible = NetMgr.instance.isCreator();
            for (var i = 0; i < this.topBtns.length; ++i)
                this.topBtns[i].visible = true;
            NetMgr.instance.painterIndex = null;
        }.bind(this))
    };

    __proto.refreshUser = function () {
        for (var i = 0; i < this.headArr.length; ++i) {
            if (this.headArr[i] == undefined) continue;
            this.headArr[i].removeSelf();
            this.headArr[i].destroy();
        }
        this.headArr = new Array(6);
        for (var i = 0; i < NetMgr.instance.getPlayerNum(); ++i) {
            var seat = NetMgr.instance.getSeat(i);
            if (seat.online && seat.isPlayer) {
                var head = new Head(seat.nickName, seat.sex, seat.avatar);
                head.scaleX *= 0.85;
                head.scaleY *= 0.85;
                head.pos(this.posArr[i].x, this.posArr[i].y - 2.5);
                this.addChild(head);
                this.headArr[i] = head;
                if (i == NetMgr.instance.seatIndex) {
                    head.nameTxt.color = "#ff0000";
                    head.nameTxt.strokeColor = "#ff0000";
                }
                if (seat.ready)
                    head.showReady();
            }
        }
    }

    return RoomView;
}(Laya.View));