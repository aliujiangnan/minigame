/*
* Bee;
*/
var Bee = (function (_super) {
    function Bee(type) {
        Bee.super(this);
        this.orginType = type;
        this.type = type;
        this.row = 0;
        this.column = 0;
        this.state = "idle";
        this.hitable = true;
        this.backFlag = false;
        this.initSelf();
    }
    Laya.class(Bee, "Bee", _super);
    Bee.prototype.initSelf = function () {
        var anim = new Laya.Animation();
        anim.play(0, true, "bee_" + this.type);
        var bounds = anim.getBounds();
        anim.pivot(bounds.width / 2, bounds.height / 2);
        anim.pos(bounds.width / 2, bounds.height / 2);
        anim.interval = 100;
        anim.zOrder = 100;
        this.addChild(anim);
        this.anim = anim;

        this.size(bounds.width, bounds.height);
        this.pivot(this.width / 2, this.height / 2);

        this.scaleY = Global.scaleY;

        this.direction = 0;
        this.rev = 0;
        this.rotateRadius = 0;
        this.startX = 0;
        this.startY = 0;
        this.startRotation = 0;
        this.selfRotation = 0;
        this.rotateTime = 0;
        this.moveAngle = 0;
        this.speed = 0;
        this.addtion = 0;
        this.attackSpeed = 0;
    };
    
    Bee.prototype.change = function (type) {
        if (this.type == 0) return;

        if(type == undefined) this.type--;
        else this.type = type;

        var img = Laya.loader.getRes("texture/game/bee_" + this.type + "_0.png");
        this.anim.stop();
        this.anim.play(0, true, "bee_" + this.type);
        var bounds = this.anim.getBounds();
        this.size(bounds.width, bounds.height);
        this.pivot(this.width / 2, this.height / 2);
    }
    Bee.prototype.attack = function (speed, target) {
        this.beginPos = { x: this.x, y: this.y };
        this.honeyBeginPos = {x: this.honeycomb.x, y:this.honeycomb.y};
        this.state = "moving_0";
        this.target = { x: target.x, y: target.y };
        this.zOrder = 1000;
        this.moveAngle = - 90;
        this.attackSpeed = speed;
        this.speed = this.attackSpeed;
        Laya.timer.frameLoop(1, this, this.move);

        if(Global.isMusicOn) Laya.SoundManager.playSound("sound/rotate.mp3");
        Laya.timer.once(500, this, function () {
            this.stopAction();
            this.state = "rotating_0";
            this.rotateWithCenter({ x: this.x + 100, y: this.y }, this.attackSpeed / 100 / (2 * Math.PI) * 360, -1, 100, 0);
        }.bind(this))
    };
    Bee.prototype.back = function (fn) {
        this.hitable = true;
        this.state = "backing";
        this.stopAction();
        this.pos(600, 0);
        
        this.pivot(this.width / 2, 0);
        var pos = { x: this.beginPos.x + this.honeycomb.x - this.honeyBeginPos.x, y: this.beginPos.y - this.height / 2 };
        var angle = Utils.getS2TAngle(pos, { x: this.x, y: this.y }, 1);
        this.rotation = 90 - angle + 180;
        var d = Utils.getP2PDistance({ x: this.x, y: this.y }, pos);

        Laya.Tween.to(this, pos, d / 200 * 1000);

        Laya.timer.once(d / 200 * 1000 * 0.8, this, function(){
            Laya.Tween.clearAll(this);
            pos = { x: this.beginPos.x + this.honeycomb.x - this.honeyBeginPos.x, y: this.beginPos.y - this.height / 2 };
            d = Utils.getP2PDistance({ x: this.x, y: this.y }, pos);
            Laya.Tween.to(this, pos, d / 200 * 1000, null, Laya.Handler.create(this, function () {
                this.removeSelf();
                this.target = null;
                this.backFlag = false;
                this.pos(pos.x - this.honeycomb.x + this.honeycomb.width / 2, pos.y - this.honeycomb.y + this.honeycomb.height / 2);
                this.honeycomb.addChild(this);
                if(fn) fn();

                Laya.Tween.to(this, { rotation: 180 }, 500, null, Laya.Handler.create(this, function () {
                    this.state = "idle";
                    this.pos(pos.x - this.honeycomb.x + this.honeycomb.width / 2, pos.y - this.honeycomb.y + this.honeycomb.height / 2 + this.height / 2);
                    this.pivot(this.width / 2, this.height / 2);
                }.bind(this)));
            }.bind(this)));
        }.bind(this));

    };
    Bee.prototype.rotateWithCenter = function (center, rev, direction, radius, addtion) {
        this.scaleY = -1 * direction;
        this.direction = direction;
        this.rev = rev;
        this.center = center;
        this.addtion = addtion;
        this.rotateRadius = radius;
        this.startX = this.x;
        this.startY = this.y;
        this.startRotation = 360 + Utils.getS2TAngle({ x: this.x, y: this.y }, { x: center.x, y: center.y }, direction);
        this.rotation = 180 - this.startRotation;
        Laya.timer.frameLoop(1, this, this.rotate);
    };
    Bee.prototype.rotate = function () {
        this.rotateTime += 100 / 6 / 1000;
        this.selfRotation = this.startRotation + this.rotateTime * this.rev * this.direction;
        this.rotation = 180 - this.selfRotation;
        this.rotateRadius += this.addtion;
        this.x = this.center.x + this.rotateRadius * Math.cos(2 * Math.PI * this.selfRotation / 360);
        this.y = this.center.y - this.rotateRadius * Math.sin(2 * Math.PI * this.selfRotation / 360);
        if (this.state == "rotating_0") {
            var angle = Utils.getS2TAngle({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }, 1);
            if (this.rotation - 90 + angle > 180 + 15) {
                this.stopAction();
                this.moveAngle = this.rotation - 90;
                this.speed = this.attackSpeed;
                this.state = "moving_1";
                Laya.timer.frameLoop(1, this, this.move);
            }
        }
        else if (this.state == "rotating_1") {
            if (this.y > this.target.y) {
                this.stopAction();
                this.moveAngle = this.rotation + 90;
                this.speed = this.attackSpeed;
                Laya.timer.frameLoop(1, this, this.move);
            }
        }
    };
    Bee.prototype.move = function () {
        this.x += Math.cos(2 * Math.PI * this.moveAngle / 360) * this.speed / 60;
        this.y += Math.sin(2 * Math.PI * this.moveAngle / 360) * this.speed / 60;
        if (this.state == "moving_1") {
            var angle = Utils.getS2TAngle({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }, 1);
            if (this.rotation - 90 + angle > 180 + 30) {
                this.stopAction();
                var angle = Utils.getS2TAngle({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }, 1);
                var d = Utils.getP2PDistance({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y });
                var pos = Utils.getPosByAandD({ x: this.target.x, y: this.target.y }, angle - 60, d);
                this.state = "rotating_1";
                this.rotateWithCenter(pos, this.attackSpeed / d / (2 * Math.PI) * 360, 1, d, 0);
            }
        }
    }
    Bee.prototype.stopAction = function () {
        this.direction = 0;
        this.rev = 0;
        this.center = null;
        this.rotateRadius = 0;
        this.startX = 0;
        this.startY = 0;
        this.startRotation = 0;
        this.selfRotation = 0;
        this.rotateTime = 0;
        this.moveAngle = 0;
        this.speed = 0;
        this.addtion = 0;
        Laya.timer.clearAll(this);
    };
    return Bee;
}(Laya.Sprite));