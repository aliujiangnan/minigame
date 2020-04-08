"use strict";
cc._RF.push(module, '1a0c3G7FSdBLaykdQ8FbyN2', 'Player');
// script/view/Player.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Utils = require("../utils/Utils");
var playerInfo = require("../game/PlayerInfo");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        body: {
            default: null,
            type: cc.Sprite
        },
        arm1: {
            default: null,
            type: cc.Sprite
        },
        arm2: {
            default: null,
            type: cc.Sprite
        },
        arm3: {
            default: null,
            type: cc.Sprite
        },
        bow: {
            default: null,
            type: cc.Node
        },
        bowStrings: {
            default: [],
            type: [cc.Node]
        },
        bowHeads: {
            default: [],
            type: [cc.Node]
        },
        hand: {
            default: null,
            type: cc.Node
        },
        arrow: {
            default: null,
            type: cc.Node
        },
        curArrow: {
            default: null,
            visible: false
        },
        arrows: {
            default: [],
            visible: false
        },
        rounds: {
            default: [],
            type: [cc.Node]
        },
        shootEnable: {
            default: true,
            visible: false
        },
        ui_skin: {
            default: null,
            type: cc.SpriteAtlas
        },
        shadow: {
            default: null,
            type: cc.Node
        },
        speedMutl: {
            default: 100,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    update: function update(dt) {},
    updateSkin: function updateSkin() {
        var armIndics = [1, 2, 2, 4, 4, 1, 2, 2, 5, 3];
        this.body.spriteFrame = this.ui_skin.getSpriteFrame("game_p" + playerInfo.useSkin);
        this.arm3.spriteFrame = this.ui_skin.getSpriteFrame("game_arm_under" + armIndics[playerInfo.useSkin - 1]);
        this.arm2.spriteFrame = this.ui_skin.getSpriteFrame("game_arm_on" + armIndics[playerInfo.useSkin - 1]);
    },
    putArrow: function putArrow() {
        if (this.curArrow != null && this.curArrow.node.parent != null && this.curArrow.node.parent.name == "arm2") {
            return;
        }
        var go = cc.instantiate(this.arrow);
        go.parent = this.arrow.parent;
        go.position = this.arrow.position;
        go.active = true;
        go.zIndex = -1;
        this.curArrow = go.getComponent("Arrow");
    },
    aim: function aim(startPos, curPos) {

        this.force = Math.min(Math.abs(curPos.x - startPos.x) / 106, 1);
        var angle = Utils.getS2TAngle(startPos.x, curPos.x, startPos.y, curPos.y, 1);
        var rotation = angle;

        if (rotation > 30 && rotation < 165) rotation = 30;else if (rotation < 300 && rotation > 165) rotation = 300;

        if (rotation >= 300) this.angle = 360 - rotation;else if (rotation <= 30) this.angle = -rotation;
        this.arm1.node.parent.rotation = rotation;
        this.arm3.node.parent.rotation = rotation;
        this.arm2.node.x = -this.force * 40;

        this.rounds[0].parent.active = true;
        this.rounds[0].parent.position = cc.v2(70 + this.force * 30, this.rounds[0].parent.position.y);
        for (var i = 0; i < this.rounds.length; ++i) {
            var x = this.rounds[i].parent.convertToWorldSpaceAR(cc.v2(0, 0)).x + 30 * i;
            var x1 = this.arrow.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            var t = (x - x1) / (60 * this.force * this.speedMutl * Math.cos(Utils.getRad(this.angle)));
            var y = this.arrow.convertToWorldSpaceAR(cc.v2(0, 0)).y;
            var y1 = y + 60 * this.force * this.speedMutl * t * Math.sin(Utils.getRad(this.angle)) - 0.5 * 50 * t * t * 100;
            this.rounds[i].position = this.rounds[i].parent.convertToNodeSpaceAR(cc.v2(x, y1));
        }

        var handPos = this.hand.convertToWorldSpaceAR(cc.v2(0, 0));
        for (var _i = 0; _i < 2; ++_i) {
            var bowHeadPos = this.bowHeads[_i].convertToWorldSpaceAR(cc.v2(0, 0));

            this.bowStrings[_i].position = this.bow.convertToNodeSpaceAR(handPos);
            this.bowStrings[_i].rotation = Utils.getS2TAngle(handPos.x, bowHeadPos.x, handPos.y, bowHeadPos.y, 1) - 90 - this.arm1.node.parent.rotation + _i * 180;
            this.bowStrings[_i].scaleY = Utils.getDistance(handPos.x, bowHeadPos.x, handPos.y, bowHeadPos.y) / this.bowStrings[_i].height;
        }
    },
    shoot: function shoot() {
        this.rounds[0].parent.active = false;

        if (this.curArrow.node.parent == null || this.curArrow.node.parent.name != this.arrow.parent.name) return;

        if (!this.shootEnable) return;
        this.shootEnable = false;

        gameInstance.soundManager.playSound("shoot");

        var position = this.curArrow.node.convertToWorldSpaceAR(cc.v2(0, 0));
        this.curArrow.node.parent = this.node.parent;
        this.curArrow.node.position = cc.v2(position.x - gameInstance.canvas.node.width / 2, position.y - cc.view.getVisibleSize().height / 2);
        this.curArrow.node.rotation = this.arm1.node.parent.rotation;
        this.curArrow.node.zIndex = 1;
        this.curArrow.shoot(this.angle, this.force * this.speedMutl);
        this.resetArm();

        this.arrows.push(this.curArrow);

        this.arm2.node.x = -0.2 * 40;

        if (gameInstance.gameView.modelType == 0) {
            gameInstance.gameView.arrowNum--;
            gameInstance.gameView.updateArrow();
        }
    },
    jump: function jump() {
        this.node.runAction(cc.spawn(cc.sequence(cc.callFunc(function () {
            gameInstance.soundManager.playSound("walk1");
        }.bind(this)), cc.moveBy(.1, cc.v2(0, 40)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -40)).easing(cc.easeSineIn()), cc.callFunc(function () {
            gameInstance.soundManager.playSound("walk1");
        }.bind(this)), cc.moveBy(.1, cc.v2(0, 30)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -30)).easing(cc.easeSineIn()), cc.callFunc(function () {
            gameInstance.soundManager.playSound("walk1");
        }.bind(this)), cc.moveBy(.1, cc.v2(0, 20)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -20)).easing(cc.easeSineIn())), cc.sequence(cc.moveBy(0.6, cc.v2(200, 0)).easing(cc.easeQuadraticActionOut()), cc.moveBy(0.4, cc.v2(-200, 0)).easing(cc.easeQuadraticActionOut()))));

        this.shadow.runAction(cc.sequence(cc.scaleTo(.1, 0.7).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn()), cc.scaleTo(.1, 0.8).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn()), cc.scaleTo(.1, 0.9).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn())));
    },
    clearArrows: function clearArrows() {
        for (var i = 0; i < this.arrows.length; ++i) {
            this.arrows[i].clearSelf();
        }this.arrows = [];
    },
    resetArm: function resetArm() {
        this.angle = 0;
        this.force = 0;
        for (var i = 0; i < 2; ++i) {
            this.bowStrings[i].position = cc.v2(-20, 0);
            this.bowStrings[i].rotation = 0;
            this.bowStrings[i].scaleY = 1;
        }
    },
    reset: function reset() {
        this.clearArrows();
        if (this.curArrow != null) this.curArrow.node.parent = null;
        this.resetArm();
        this.arm1.node.parent.rotation = 0;
        this.arm2.node.x = 0;
        this.arm3.node.parent.rotation = 0;
        this.rounds[0].parent.active = false;
        this.shootEnable = true;
    }
});

cc._RF.pop();