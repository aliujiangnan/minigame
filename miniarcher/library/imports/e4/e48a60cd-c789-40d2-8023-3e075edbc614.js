"use strict";
cc._RF.push(module, 'e48a6DNx4lA0oAjPgde28YU', 'GotSkinView');
// script/view/GotSkinView.js

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
        skinSpr: {
            default: null,
            type: cc.Sprite
        },
        ui_skin: {
            default: null,
            type: cc.SpriteAtlas
        },
        btnShare: {
            default: null,
            type: cc.Node
        },
        fromType: {
            default: 1,
            visible: false
        },
        light: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    init: function init(skinType, fromType) {
        this.fromType = fromType;
        this.skinSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + skinType);

        this.btnShare.stopAllActions();
        this.btnShare.scale = 1;
        this.btnShare.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.5), cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.delayTime(1.5))));

        gameInstance.sdkHelper.showAd(0);

        this.light.stopAllActions();
        this.light.runAction(cc.repeatForever(cc.rotateBy(5, 180)));
    },
    onBtnShare: function onBtnShare() {
        gameInstance.soundManager.playSound("btn");
        gameInstance.sdkHelper.share();
    },
    onBtnClose: function onBtnClose() {
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;
        if (this.fromType == 2) {
            gameInstance.gameView.state = "running";
            gameInstance.soundManager.stopClock();
        }
        gameInstance.sdkHelper.showAd(0);
    }
});

cc._RF.pop();