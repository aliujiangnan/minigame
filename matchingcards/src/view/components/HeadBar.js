/*
* HeadBar;
*/
var HeadBar = (function (_super) {
    function HeadBar() {
        HeadBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height * 0.2);
        this.scale(Global.scaleY, Global.scaleX);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.rand = 0;

        this.initSelf();
    }

    Laya.class(HeadBar, "HeadBar", _super);

    var medalNames = ["bronze", "silver", "gold", "platinum", "diamond", "master", "king"];

    var __proto = HeadBar.prototype;
    __proto.initSelf = function () {
        var maskBg = new Laya.Sprite();
        this.addChild(maskBg);
        var mask = new Laya.Sprite();
        mask.graphics.drawRect(0, 0, 500, 60, "#ffffff");
        mask.pos(125, 102.5);
        maskBg.mask = mask;

        var leftBarBg = new Laya.Sprite();
        leftBarBg.loadImage("texture/game/progress_0.png");
        leftBarBg.pivot(leftBarBg.width / 2, leftBarBg.height / 2);
        leftBarBg.pos(this.width / 2 - leftBarBg.width / 2, this.height / 2);
        maskBg.addChild(leftBarBg);

        leftBar = new Laya.Sprite();
        leftBar.loadImage("texture/game/progress_0$bar.png");
        leftBar.pivot(leftBar.width / 2, leftBar.height / 2);
        leftBar.pos(leftBarBg.x - leftBar.width + 11, this.height / 2 - 0.5);
        maskBg.addChild(leftBar);
        this.leftBar = leftBar;

        var rightBarBg = new Laya.Sprite();
        rightBarBg.loadImage("texture/game/progress_0.png");
        rightBarBg.pivot(rightBarBg.width / 2, rightBarBg.height / 2);
        rightBarBg.pos(this.width / 2 + rightBarBg.width / 2, this.height / 2);
        maskBg.addChild(rightBarBg);

        var rightBar = new Laya.Sprite();
        rightBar.loadImage("texture/game/progress_1$bar.png");
        rightBar.pivot(rightBar.width / 2, rightBar.height / 2);
        rightBar.pos(rightBarBg.x + rightBar.width - 9, this.height / 2 - 0.5);
        rightBar.scaleX = -1;
        maskBg.addChild(rightBar);
        this.rightBar = rightBar;

        var light = new Laya.Sprite();
        light.loadImage("texture/game/light_0.png");
        light.pivot(light.width / 2, light.height / 2);
        light.pos(this.leftBar.width, this.leftBar.height / 2);
        this.leftBar.addChild(light);
        this.leftLight = light;

        var light1 = new Laya.Sprite();
        light1.loadImage("texture/game/light_0.png");
        light1.pivot(light1.width / 2, light1.height / 2);
        light1.pos(this.rightBar.width, this.rightBar.height / 2);
        this.rightBar.addChild(light1);
        this.rightLight = light1;

        var mid = new Laya.Sprite();
        mid.loadImage("texture/game/mid.png");
        mid.pivot(mid.width / 2, mid.height / 2);
        mid.pos(this.width / 2, this.height / 2 - 15.5);
        this.addChild(mid);

        var leftBg = new Laya.Sprite();
        leftBg.loadImage("texture/game/bg_head_0.png");
        leftBg.pivot(leftBg.width / 2, leftBg.height / 2);
        leftBg.pos(leftBg.width / 2 + 43, this.height / 2);
        leftBg.zOrder = 10;
        this.addChild(leftBg);

        var rightBg = new Laya.Sprite();
        rightBg.loadImage("texture/game/bg_head_0.png");
        rightBg.pivot(rightBg.width / 2, rightBg.height / 2);
        rightBg.pos(this.width - rightBg.width / 2 - 42, this.height / 2);
        rightBg.zOrder = 10;
        this.addChild(rightBg);

        var leftHead = new Laya.Sprite();
        leftHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
        leftHead.pivot(leftHead.width / 2, leftHead.height / 2);
        leftHead.pos(leftBg.x, this.height / 2);
        leftHead.size(leftHead.width, leftHead.height);
        leftHead.zOrder = 11;
        this.addChild(leftHead);
        this.leftHead = leftHead;

        var rightHead = new Laya.Sprite();
        rightHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
        rightHead.pivot(rightHead.width / 2, rightHead.height / 2);
        rightHead.pos(rightBg.x, this.height / 2);
        rightHead.size(rightHead.width, rightHead.height);
        rightHead.zOrder = 11;
        this.addChild(rightHead);
        this.rightHead = rightHead;

        var leftHead1 = new Laya.Sprite();
        leftHead1.pivot(rightHead.width / 2, rightHead.height / 2);
        leftHead1.pos(leftBg.x, this.height / 2);
        leftHead1.size(rightHead.width, rightHead.height);
        leftHead1.zOrder = 11;
        this.addChild(leftHead1);
        this.leftHead1 = leftHead1;

        var rightHead1 = new Laya.Sprite();
        rightHead1.pivot(rightHead.width / 2, rightHead.height / 2);
        rightHead1.pos(rightBg.x, this.height / 2);
        rightHead1.size(rightHead1.width, rightHead1.height);
        this.addChild(rightHead1);
        this.rightHead1 = rightHead1;
        this.rightHead1.zOrder = 11;

        var circle = new Laya.Sprite();
        circle.loadImage("texture/view/end/round_1.png");
        circle.pivot(circle.width / 2, circle.height / 2);
        circle.pos(leftBg.x, this.height / 2);
        this.addChild(circle);
        this.leftCircle = circle;
        this.leftCircle.zOrder = 12;

        var circle1 = new Laya.Sprite();
        circle1.loadImage("texture/view/end/round_1.png");
        circle1.pivot(circle1.width / 2, circle1.height / 2);
        circle1.pos(rightBg.x, this.height / 2);
        this.addChild(circle1);
        this.rightCircle = circle1;
        this.rightCircle.zOrder = 12;

        var sex = new Laya.Sprite();
        sex.loadImage("texture/game/sex_0.png");
        sex.pivot(sex.width / 2, sex.height / 2);
        sex.pos(this.leftHead1.x + 55, this.leftHead1.y + 55);
        sex.zOrder = 11;
        this.addChild(sex);
        this.leftSex = sex;

        var sex1 = new Laya.Sprite();
        sex1.loadImage("texture/game/sex_0.png");
        sex1.pivot(sex1.width / 2, sex1.height / 2);
        sex1.pos(this.rightHead1.x - 55, this.rightHead1.y + 55);
        sex1.zOrder = 11;
        this.addChild(sex1);
        this.rightSex = sex1;

        var badge = new Laya.Sprite();
        badge.loadImage("texture/medal/profile_medal_bronze_default@1x.png");
        badge.size(80, 80);
        badge.pivot(badge.width / 2, badge.height / 2);
        badge.pos(this.leftCircle.width / 2, this.leftCircle.height - 9);
        badge.scale(0.75, 0.75);
        badge.zOrder = 21;
        this.leftCircle.addChild(badge);
        this.leftBadge = badge;

        var badge1 = new Laya.Sprite();
        badge1.loadImage("texture/medal/profile_medal_bronze_default@1x.png");
        badge1.size(80, 80);
        badge1.pivot(badge1.width / 2, badge1.height / 2);
        badge1.pos(this.rightCircle.width / 2, this.rightCircle.height - 9);
        badge1.scale(0.75, 0.75);
        badge1.zOrder = 21;
        this.rightCircle.addChild(badge1);
        this.rightBadge = badge1;

        this.leftX = this.leftBar.x;
        this.rightX = this.rightBar.x;
    };

    __proto.addProgress = function (type, num) {
        if (type == 0) {
            if ((num - 2) / 24 > 0.65 && (num - 2) / 24 < 0.75) {
                this.leftLight.graphics.clear();
                this.leftLight.loadImage("texture/game/light_1.png");

                var func = function (light) {
                    Laya.Tween.to(light, { scaleX: 1.075, scaleY: 1.075 }, 100, null, Laya.Handler.create(this, func1));
                };
                var func1 = function (light) {
                    Laya.Tween.to(light, { scaleX: 1, scaleY: 1 }, 100);
                };

                Laya.timer.once(0, this, func, [this.leftLight]);
                Laya.timer.loop(200, this, func, [this.leftLight]);
            }

            var offset = num / 24 * 240;
            Laya.Tween.to(this.leftBar, { x: this.leftX + offset }, 500);
        }
        else if (type == 1) {
            if ((num - 2) / 24 > 0.65 && (num - 2) / 24 < 0.75) {
                this.rightLight.graphics.clear();
                this.rightLight.loadImage("texture/game/light_1.png");

                var func = function (light) {
                    Laya.Tween.to(light, { scaleX: 1.075, scaleY: 1.075 }, 100, null, Laya.Handler.create(this, func1, [light]));
                };
                var func1 = function (light) {
                    Laya.Tween.to(light, { scaleX: 1, scaleY: 1 }, 100);
                };

                Laya.timer.once(0, this, func, [this.rightLight]);
                Laya.timer.loop(200, this, func, [this.rightLight]);
            }

            var offset = num / 24 * 240;
            Laya.Tween.to(this.rightBar, { x: this.rightX - offset }, 500, null, Laya.Handler.create(this, function () {
            }));
        }
    }

    __proto.setHead = function (dataArray) {
        this.leftHead1.loadImage(UserMgr.instance.avatar, -2, -2, 92, 92, Laya.Handler.create(this, function () {
            this.leftHead.graphics.drawCircle(this.leftHead1.width / 2, this.leftHead1.width / 2, this.leftHead1.width / 2, "#ffffff");
        }));

        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(-2, -2, 92 / 2, "#ffffff");
        mask.pos(this.leftHead1.width / 2, this.leftHead1.height / 2);
        this.leftHead1.mask = mask;

        var opponent = NetMgr.instance.getOpponent();
        this.rightHead1.loadImage(opponent.avatar, -2, -2, 92, 92, Laya.Handler.create(this, function () {
            this.rightHead.graphics.drawCircle(this.rightHead1.width / 2, this.rightHead1.width / 2, this.rightHead1.width / 2, "#ffffff");
        }));

        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(-2, -2, 92 / 2, "#ffffff");
        mask.pos(this.rightHead1.width / 2, this.rightHead1.height / 2);
        this.rightHead1.mask = mask;

        this.leftSex.graphics.clear();
        this.leftSex.loadImage("texture/game/sex_" + UserMgr.instance.sex + ".png");

        this.rightSex.graphics.clear();
        this.rightSex.loadImage("texture/game/sex_" + opponent.sex + ".png");

        this.setMedal();
    };
    __proto.setMedal = function () {
        var level = UserMgr.instance.level;
        var medal = parseInt((level - 1) / 5);
        var medalName = "bronze_default";
        if (level > 31) {
            medalName = "king_2";
        }
        else if (level > 0) {
            medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
        }
        this.leftBadge.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");

        var opponent = NetMgr.instance.getOpponent();
        level = opponent.level;
        medal = parseInt((level - 1) / 5);
        medalName = "bronze_default";
        if (level > 31) {
            medalName = "king_2";
        }
        else if (level > 0) {
            medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
        }
        this.rightBadge.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");
    }

        __proto.showEmoji = function (id, loc) {
        var bg = new Laya.Sprite();
        bg.zOrder = 100;
        this.addChild(bg);

        var emoji = new Laya.Sprite();
        emoji.loadImage("texture/emoji/" + (id) + ".png", 0, 0);
        emoji.pivotX = emoji.width / 2;
        bg.addChild(emoji);

        var posArray;
        if (loc == 0) {
            bg.x = this.leftHead1.x + 70;
            bg.y = this.leftHead1.y - 17;
            if (id == 5) bg.x += 20;
            var l = 150;
            posArray = [
                [bg.x + l * Math.cos(Math.PI / 4), bg.y + l * Math.sin(Math.PI / 4)],
                [bg.x + l * Math.cos(Math.PI / 8), bg.y + l * Math.sin(Math.PI / 8)],
                [bg.x + l, bg.y]
            ]

        }
        else {
            bg.x = this.rightHead1.x - 70;
            bg.y = this.rightHead1.y - 17;
            if (id == 5) bg.x -= 20;
            else if (id == 6) bg.scaleX = -1;
            var l = 150;
            posArray = [
                [bg.x - l * Math.cos(Math.PI / 4), bg.y + l * Math.sin(Math.PI / 4)],
                [bg.x - l * Math.cos(Math.PI / 8), bg.y + l * Math.sin(Math.PI / 8)],
                [bg.x - l, bg.y]
            ]
        }

        var i = this.getRand();
        var posX = posArray[i][0];
        Laya.Tween.to(bg, { x: posArray[i][0], y: posArray[i][1] }, 1000);
        Laya.timer.once(400, this, function () {
            Laya.Tween.to(bg, { alpha: 0 }, 600);
        })
        Laya.timer.once(1000, this, function () {
            this.removeChild(bg);
        })
    };

    __proto.getRand = function () {
        var i = parseInt("" + Math.random() * 3);
        if (i != this.m_rand) {
            this.m_rand = i;
        }
        else {
            this.m_rand = this.getRand();
        }

        return this.m_rand;
    }

    return HeadBar;
}(Laya.View));