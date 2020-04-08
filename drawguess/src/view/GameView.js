/*
* GameView;
*/
var GameView = (function (_super) {
    function GameView() {
        GameView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.initSelf();
    }

    Laya.class(GameView, "GameView", _super);

    var resArr = ["btn_pen_1.png", "btn_color_1.png", "btn_eraser_1.png"];
    var resArr1 = ["btn_pen_2.png", "btn_color_2.png", "btn_eraser_2.png"];

    var __proto = GameView.prototype;
    __proto.initSelf = function () {
        var sp = new Laya.Sprite();
        sp.graphics.drawRect(0, 0, 750, 1334, "#ffffff");
        this.addChild(sp);

        var bg = new Laya.Sprite();
        bg.loadImage("res/draw/bg_1.png");
        this.addChild(bg);

        var offsetY = 100;

        var bg1 = new Laya.Sprite();
        bg1.loadImage("res/draw/bg_2.png");
        bg1.y = this.height - bg1.height + offsetY;
        this.addChild(bg1);

        var container = new Laya.Sprite();
        container.size(bg1.width, bg1.height);
        this.addChild(container);

        this.drawBtns = [];
        for (var i = 0; i < 3; ++i) {
            var btn = new Laya.Button("res/draw/" + resArr1[i]);
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.pos(this.width * 0.12 * i + 50, this.height * 0.614 + offsetY);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [i, btn], false)
            this.addChild(btn);
            btn.visible = NetMgr.instance.isPlayer && NetMgr.instance.isPainter();
            this.drawBtns.push(btn);
        }

        var posArr = [
            [0.42, 0.614],
            [0.8, 0.614],
            [0.95, 0.614],
        ]

        this.guessBtns = [];
        for (var i = 0; i < 3; ++i) {
            var btn = new Laya.Button("res/draw/btn_" + (i + 1) + ".png");
            btn.anchorX = 0.5;
            btn.anchorY = i < 3 ? 0.5 : 0;
            btn.stateNum = 2;
            btn.pos(this.width * posArr[i][0], this.height * posArr[i][1] - 3 + offsetY);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [i + 3], false)
            this.addChild(btn);
            if (i == 0) {
                this.drawBtns.push(btn);
                btn.visible = NetMgr.instance.isPlayer && NetMgr.instance.isPainter();
            }
            else {
                this.guessBtns.push(btn);
                btn.visible = NetMgr.instance.isPlayer && !NetMgr.instance.isPainter();
            }
        }

        var descrip = new Laya.Text();
        descrip.fontSize = 36;
        descrip.width = 300;
        descrip.pivotX = 150;
        descrip.color = "#ffe49c";
        descrip.align = "center";
        descrip.pos(Laya.stage.width * 0.5, Laya.stage.height * 0.1 - 37);
        container.addChild(descrip);
        this.descripTxt = descrip;

        var lineTxt = new Laya.Text();
        lineTxt.fontSize = 36;
        lineTxt.width = 750;
        lineTxt.pivotX = 375;
        lineTxt.color = "#ffffff";
        lineTxt.align = "center";
        lineTxt.pos(Laya.stage.width * 0.5 + 1, Laya.stage.height * 0.1 - 35);
        container.addChild(lineTxt);
        this.lineTxt = lineTxt;

        this.headArr = new Array(6);
        for (var i = 0; i < 6; ++i) {
            var headBg = new Laya.Sprite();
            headBg.loadImage("res/draw/bg_head.png");
            headBg.pivot(headBg.width / 2, headBg.height / 2)
            headBg.scale(Global.scaleX, Global.scaleY);
            headBg.pos(this.width * 0.17 * i + 53, this.height * 0.674 + 4 + offsetY);
            this.addChild(headBg);

            var seat = NetMgr.instance.getSeat(i);
            if (seat && seat.isPlayer && seat.online) {
                var head = new Head(seat.nickName, seat.sex, seat.avatar, 1);
                head.pos(this.width * 0.17 * i + 53, this.height * 0.674 + 4 + offsetY);
                this.addChild(head);
                this.headArr[i] = head;
                if (i == NetMgr.instance.painterIndex) {
                    head.bg.graphics.clear();
                    head.bg.loadImage("res/draw/bg_head_1.png");
                    head.draw.visible = true;
                }
            }
        }
        var view = new DrawView();
        this.addChild(view);
        this.drawView = view;
        this.displayStrs = [];

        var penBar = new PenBar(this.drawBtns[0]);
        penBar.visible = false;
        this.addChild(penBar);
        this.penBar = penBar;

        var colorBar = new ColorBar(this.drawBtns[1]);
        colorBar.visible = false;
        this.addChild(colorBar);
        this.colorBar = colorBar;

        var eraserBar = new EraserBar(this.drawBtns[2]);
        eraserBar.visible = false;
        this.addChild(eraserBar);
        this.eraserBar = eraserBar;
    };
    __proto.refreshUser = function () {
        for (var i = 0; i < this.headArr.length; ++i) {
            if (this.headArr[i]) {
                this.headArr[i].removeSelf();
                this.headArr[i].destroy();
            }
        }

        this.headArr = new Array(6);
        for (var i = 0; i < 6; ++i) {
            var seat = NetMgr.instance.seats[i];
            if (seat && seat.isPlayer && seat.online) {
                var head = new Head(seat.nickName, seat.sex, seat.avatar, 1);
                head.pos(this.width * 0.17 * i + 53, this.height * 0.674 + 4);
                this.addChild(head);
                this.headArr[i] = head;
                if (i == NetMgr.instance.painterIndex) {
                    head.bg.graphics.clear();
                    head.bg.loadImage("res/draw/bg_head_1.png");
                    head.draw.visible = true;
                }
            }
        }
    };
    __proto.updateBtnVisible = function () {
        for (var i = 0; i < this.drawBtns.length; ++i)
            this.drawBtns[i].visible = NetMgr.instance.isPlayer && NetMgr.instance.isPainter();
        for (var i = 0; i < this.guessBtns.length; ++i) {
            this.guessBtns[i].visible = NetMgr.instance.isPlayer && !NetMgr.instance.isPainter();
        }
    }
    __proto.setDescription = function (str) {
        this.lineTxt.text = "";
        var strLen = 0;
        for (var i = 0; i < str.length; ++i) {
            var p = /[a-z]/i; var b = p.test(str[i]);//true
            b = (str[i] == "-" || str[i] == "'") ? true : b;
            var s = b ? "_" : str[i];
            var s = i == str.length - 1 ? s : s + " ";
            this.lineTxt.text += s;
            if (b) strLen++;
        }

        var getDisplayStrs = function (str, n) {
            var i = parseInt(Utils.seededRandom() * str.length);
            var p = /[a-z]/i; var b = p.test(str[i]);//true
            b = (str[i] == "-" || str[i] == "'") ? true : b;
            if (!b) return getDisplayStrs(str, n);
            for (var j = 0; j < this.displayStrs.length; ++j) {
                if (i == j)
                    return getDisplayStrs(str, n);
            }
            this.displayStrs.push(i);
            if (this.displayStrs.length < n)
                return getDisplayStrs(str, n);
        }.bind(this);

        var n = parseInt(strLen / 4);
        if (n > 0) getDisplayStrs(str, n);
        if (this.displayStrs.length > 0) {
            var t = 20 / (n + 1);
            var count = 0;
            var displayStr = function () {
                if (count > n) return;
                var index = this.displayStrs[count];
                var isFinal = index == str.length - 1;
                var lineText = "";
                for (var i = 0; i < this.lineTxt.text.length; ++i) {
                    var s = i == index * 2 ? str[index] : this.lineTxt.text[i];
                    lineText += s;
                }
                this.lineTxt.text = lineText;
                count++;
                Laya.timer.once(t * 1000, this.lineTxt, displayStr);
            }.bind(this);

            Laya.timer.once(t * 1000, this.lineTxt, displayStr);
        }
        this.descripTxt.text = "";
    };

    __proto.resetBtns = function(){
        for(var i = 0; i < this.drawBtns.length; ++i){
            this.drawBtns[i].skin = "res/draw/" + resArr1[i];
        }
    }

    __proto.btnFunc = function (index, btn) {
        this.drawView.drawCanvas();
        this.resetBtns();
        switch (index) {
            case 0:
                if (this.penBar.visible) {
                    btn.skin = "res/draw/" + resArr1[index];
                    this.drawView.clearCanvas();
                    this.penBar.visible = false;
                }
                else {
                    btn.skin = "res/draw/" + resArr[index];
                    this.penBar.showSelf();
                    this.colorBar.visible = false;
                    this.eraserBar.visible = false;
                }
                break;
            case 1:
                if (this.colorBar.visible) {
                    btn.skin = "res/draw/" + resArr1[index];
                    this.drawView.clearCanvas();
                    this.colorBar.visible = false;
                }
                else {
                    btn.skin = "res/draw/" + resArr[index];
                    this.colorBar.showSelf();
                    this.penBar.visible = false;
                    this.eraserBar.visible = false;
                }
                break;
            case 2:
                if (this.eraserBar.visible) {
                    btn.skin = "res/draw/" + resArr1[index];
                    this.drawView.clearCanvas();
                    this.eraserBar.visible = false;
                }
                else {
                    btn.skin = "res/draw/" + resArr[index];
                    this.eraserBar.showSelf();
                    this.penBar.visible = false;
                    this.colorBar.visible = false;
                }
                break;
            case 3:
                var leaveBar = new LeaveBar();
                leaveBar.pos(this.width / 2, this.height / 2);
                this.addChild(leaveBar);
                break;
            case 4:
                break;
            case 5:
                var reportBar = new ReportBar();
                reportBar.pos(this.width / 2, this.height / 2);
                this.addChild(reportBar);
                break;
        }
    }

    return GameView;
}(Laya.View));