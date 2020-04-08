/*
 * Pawn;
 */
var Pawn = (function (_super) {
    function Pawn(type, color) {
        Pawn.super(this);
        this.type = type;
        this.color = color;
        this.state = 0;
        this.cached = false;
        this.hasOpen = false;
        this.initSelf();
    }

    Laya.class(Pawn, "Pawn", _super);

    var upY = 30;
    var upX = 2;
    var __proto = Pawn.prototype;
    __proto.initSelf = function () {
        var creatAniURL = function (name, amount) {
            var URLarr = [];
            for (var i = 1; i <= amount; i++) {
                if (i < 10) {
                    var URL = name + "0" + i + ".png";
                } else {
                    var URL = name + i + ".png";
                }
                URLarr.push(URL);
            }
            return URLarr;
        }
        if (!this.cached) {
            this.cached = true;
            Laya.Animation.createFrames(creatAniURL("texture/anim/openAni/lh_", 18), "open");
            Laya.Animation.createFrames(creatAniURL("texture/anim/eatAni/q_", 19), "eat");
        }

        var box = new Laya.Sprite();
        box.loadImage("texture/game/bg_animal_2.png");
        box.zOrder = 5;
        box.y = -20;
        this.box = box;

        this.size(box.width, box.height);
        this.pivot(box.width / 2, box.height / 2);

        var content = new Laya.Sprite();
        content.pivot(this.width / 2, this.height / 2);
        content.pos(this.width / 2, this.height / 2);
        content.zOrder = 10;
        this.addChild(content);
        this.content = content;
        this.content.addChild(box);
        this.contentX = this.content.x;
        this.contentY = this.content.y;

        this.posArr = [[this.width / 2, this.height / 2 - 183 / 2],[this.width / 2, this.height / 2 + 183 / 2 - 20],[this.width / 2 - 183 / 2, this.height / 2],[this.width / 2 + 183 / 2, this.height / 2]];

        var border = new Laya.Sprite();
        border.loadImage("texture/game/border_0_1.png");
        border.pivot(border.width / 2, border.height / 2);
        border.pos(this.width / 2, this.height / 2 - 5);
        border.zOrder = 9;
        border.name = "border";
        this.addChild(border);
        this.border = border;

        var border1 = new Laya.Sprite();
        border1.loadImage("texture/game/border_0_2.png");
        border1.pivot(border1.width / 2, border1.height / 2);
        border1.pos(this.width / 2, this.height / 2 - 50);
        border1.zOrder = 6;
        border1.name = "borderBox";
        this.content.addChild(border1);
        this.borderBox = border1;
    };

    __proto.displayUseful = function (j) {
        var arr = [[0, -10], [0, 10], [-10, 0], [10, 0],];

        var delta = new Laya.Sprite();
        delta.loadImage("texture/game/delta_" + j + "_green.png");
        delta.pivot(delta.width / 2, delta.height / 2);
        delta.pos(this.posArr[j][0], this.posArr[j][1]);
        delta.name = "delta_" + j;
        delta.zOrder = 100;
        this.content.addChild(delta);

        var x = arr[j][0];
        var y = arr[j][1];
        Laya.Tween.to(delta, { x: delta.x + x, y: delta.y + y }, 500);
        Laya.timer.once(500, delta, function () { Laya.Tween.to(delta, { x: delta.x - x, y: delta.y - y }, 500); });
        Laya.timer.loop(1000, delta, function (delta, x, y) {
            Laya.Tween.to(delta, { x: delta.x + x, y: delta.y + y }, 500);
            Laya.timer.once(500, delta, function () { Laya.Tween.to(delta, { x: delta.x - x, y: delta.y - y }, 500); });
        }, [delta, x, y]);
    }

    __proto.hiddenUseful = function () {
        for (var i = 0; i < 4; i++)
            this.content.removeChildByName("delta_" + i);
    }

    __proto.setFront = function () {
        if (Global.isMusicOn) Laya.SoundManager.playSound("sound/animal_" + this.type + ".wav");
        this.state = 1;
        this.borderBox.visible = false;
        this.hasOpen = true;

        this.border.pos(this.width / 2, this.height / 2 - 2);
        this.border.graphics.clear();
        this.border.loadImage("texture/game/border_1.png");

        var anim = new Laya.Animation();
        anim.zOrder = this.content.zOrder + 1;
        anim.interval = 25;
        anim.play(0, false, "open");
        var bound = anim.getBounds();
        anim.pivot(bound.width >> 1, bound.height >> 1);
        anim.pos(65, 15);
        anim.scale(0.7, 0.7);
        this.anim = anim;
        this.content.addChild(anim);

        this.box.graphics.clear();
        anim.on("complete", this, function () {
            anim.clear();
        });
        
        var shadow = new Laya.Sprite();
        shadow.loadImage("texture/game/shadow.png");
        shadow.pivot(shadow.width / 2, shadow.height / 2);
        shadow.pos(shadow.width / 2, shadow.height / 2 + 20);
        this.addChild(shadow);
        this.shadow = shadow;

        var img = Laya.loader.getRes("texture/game/bg_animal_0.png");
        this.size(img.width / 2, img.height / 2);
        this.content.pivot(img.width / 2, img.height / 2);

        var base = new Laya.Sprite();
        base.loadImage("texture/game/bg_animal_" + this.color + ".png");
        this.content.addChild(base);
        base.zOrder = 2;
        this.base = base;

        var animal = new Laya.Sprite();
        animal.loadImage("texture/game/animal_" + this.type + ".png");
        animal.pivot(animal.width / 2, animal.height - 10);
        animal.pos(this.width, this.height * 2 - 40);
        animal.scaleY = 0;
        animal.zOrder = 3;
        this.content.addChild(animal);
        this.animal = animal;

        Laya.Tween.to(animal, {scaleY: 1}, 600, Laya.Ease.elasticOut);

        this.selfZOrder = this.zOrder;
    };

    __proto.moveUp = function () {
        Laya.Tween.clearAll(this.content);
        Laya.Tween.to(this.content, {scaleX: 1.1,scaleY: 1.1,x: this.contentX - upX,y: this.contentY - upY}, 350, Laya.Ease.quintOut);
        Laya.timer.once(20, this, function () {
            this.zOrder = 200;
        }.bind(this))
        Laya.timer.once(0, this, function () {
            Laya.Tween.to(this.shadow, {scaleX: 0.8,scaleY: 0.8,alpha: 0.8}, 125);
        }.bind(this));
    };

    __proto.moveDown = function (isDisplaySmoke) {
        if (isDisplaySmoke === void 0) isDisplaySmoke = false;
        this.zOrder = this.selfZOrder;

        this.hiddenUseful();
        Laya.Tween.clearAll(this.content);
        Laya.Tween.to(this.content, {scaleX: 1,scaleY: 1,x: this.contentX,y: this.contentY}, 100);

        Laya.timer.once(0, this, function () {
            Laya.Tween.to(this.shadow, {scaleX: 1,scaleY: 1,alpha: 1}, 125);
        }.bind(this));

    };
    __proto.fallDown = function (isDisplaySmoke, isClear) {
        this.hiddenUseful();
        Laya.Tween.clearAll();

        Laya.timer.once(0, this, function () {
            Laya.Tween.to(this.shadow, {scaleX: 1,scaleY: 1,alpha: 1}, 125);
        }.bind(this));

        var func = function () {
            Laya.Tween.to(this.content, {scaleX: 1,scaleY: 1,x: this.contentX,y: this.contentY}, 200, Laya.Ease.quintIn, Laya.Handler.create(this, function () {
                this.zOrder = this.selfZOrder;
                if (isDisplaySmoke) {
                    this.anim.zOrder = 1;
                    this.anim.interval = 25;
                    this.anim.scale(1.2, 1.2);
                    this.anim.play(0, false, "eat");
                    var bound = this.anim.getBounds();
                    this.anim.pivot(bound.width >> 1, bound.height >> 1);
                    this.anim.pos(45 * 2, (20 + 20) * 2);
                }
                if (isClear) {
                    this.animal.removeSelf();
                    this.shadow.removeSelf();
                    this.box.removeSelf();
                    this.base.removeSelf();
                    Laya.timer.once(1000, this, this.removeSelf);
                }
            }));
        };

        var func1 = function () {
            Laya.Tween.to(this.animal, {scaleY: 1,}, 150);
        }.bind(this);

        Laya.timer.once(550, this, function () {
            Laya.Tween.to(this.animal, {scaleY: 0.9,}, 150, null, Laya.Handler.create(this, func1));
        }.bind(this));

        Laya.Tween.to(this.content, {scaleX: 1.4,scaleY: 1.4,x: this.contentX - upX * 2,y: this.contentY - upY * 2}, 350, Laya.Ease.quintOut, Laya.Handler.create(this, func));
    };

    __proto.displayBorder = function () {
        if (!this.hasOpen) {
            this.borderBox.visible = true;
        }
        this.border.visible = true;
    };

    __proto.hiddenBorder = function () {
        this.border.visible = false;
        this.borderBox.visible = false;
    }
    return Pawn;
}(Laya.Sprite));
