"use strict";
cc._RF.push(module, '97d05J8ah1P1rpTZXnsI3MN', 'ShopView');
// script/view/ShopView.js

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
        items: {
            default: [],
            type: [require("ShopItem")]
        },
        curSpr: {
            default: null,
            type: cc.Sprite
        },
        ui_skin: {
            default: null,
            type: cc.SpriteAtlas
        },
        goldLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        var i6 = 1334 / 750;
        var windowSize = cc.view.getVisibleSize();
        var cur = windowSize.height / windowSize.width;

        if (cur.toFixed(3) > i6.toFixed(3)) {
            var widget = this.goldLabel.node.parent.parent.getComponent(cc.Widget);
            widget.top = 225;
            widget.updateAlignment();
        }
    },
    init: function init() {

        var skinList = JSON.parse(playerInfo.skinList);
        var shopList = JSON.parse(playerInfo.shopList);

        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i];
            item.selfSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + shopList[i]);
            item.skinNo = shopList[i];
            item.selfSpr.node.color = skinList[shopList[i] - 1] == 1 ? cc.color(255, 255, 255) : cc.color(0, 0, 0);
        }
        this.curSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + playerInfo.useSkin);
        this.goldLabel.string = playerInfo.gold + "";
    },
    onClickItem: function onClickItem(eve, data) {
        gameInstance.soundManager.playSound("btn");
        var skinList = JSON.parse(playerInfo.skinList);
        var shopList = JSON.parse(playerInfo.shopList);
        var index = JSON.parse(data);
        var no = playerInfo.useSkin;
        if (skinList[shopList[index] - 1] == 0) {
            return;
        }
        playerInfo.useSkin = this.items[index].skinNo;
        shopList[index] = no;
        playerInfo.shopList = JSON.stringify(shopList);
        this.items[index].skinNo = no;
        this.items[index].selfSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + no);
        this.curSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + playerInfo.useSkin);
        gameInstance.gameView.player.updateSkin();

        cc.sys.localStorage.setItem("playerinfo_useskin", playerInfo.useSkin);
        cc.sys.localStorage.setItem("playerinfo_shoplist", playerInfo.shopList);
        gameInstance.sdkHelper.uploadPlayerInfo();
    },
    onBtnUnlock: function onBtnUnlock() {
        gameInstance.soundManager.playSound("btn");
        if (playerInfo.gold < 30) return;
        var skinList = JSON.parse(playerInfo.skinList);
        var shopList = JSON.parse(playerInfo.shopList);
        var hasNum = 0;
        for (var i = 0; i < skinList.length; ++i) {
            if (skinList[i] == 1) hasNum++;
        }if (hasNum == skinList.length) return;

        var delay = Math.max(0.3 * (10 - hasNum) / 9, .2);
        var lastIdx = -1;
        var func = function () {
            var _this = this;

            var _loop = function _loop() {
                var idx = parseInt(Math.random() * 9);
                if (skinList[shopList[idx] - 1] == 1 || hasNum < 9 && idx == lastIdx) return "continue";

                _this.items[idx].selfSpr.node.scale = 1;
                _this.items[idx].selfSpr.node.stopAllActions();

                _this.items[idx].selfSpr.node.runAction(cc.sequence(cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut()), cc.scaleTo(.1, 1).easing(cc.easeQuadraticActionIn())));

                if (hasNum == 9 || delay < 0.15) {
                    skinList[shopList[idx] - 1] = 1;
                    _this.items[idx].selfSpr.node.color = cc.color(255, 255, 255);
                    playerInfo.skinList = JSON.stringify(skinList);
                    cc.sys.localStorage.setItem("playerinfo_skinlist", playerInfo.skinList);
                    playerInfo.gold -= 30;
                    cc.sys.localStorage.setItem("playerinfo_gold", playerInfo.gold);
                    gameInstance.startView.updateSkinNum();
                    gameInstance.gameView.updateGold();
                    _this.goldLabel.string = "" + playerInfo.gold;

                    setTimeout(function () {
                        gameInstance.gotSkinView.node.active = true;
                        gameInstance.gotSkinView.init(shopList[idx], 1);
                    }, .2);

                    gameInstance.sdkHelper.uploadPlayerInfo();
                    return "break";
                }

                setTimeout(func, delay * 1000);
                delay -= 0.01;
                lastIdx = idx;
                return "break";
            };

            _loop2: while (true) {
                var _ret = _loop();

                switch (_ret) {
                    case "continue":
                        continue;

                    case "break":
                        break _loop2;}
            }
        }.bind(this);

        func();
    },
    onBtnPlayAd: function onBtnPlayAd() {
        gameInstance.soundManager.playSound("btn");
        gameInstance.sdkHelper.showAd(2, function (status) {
            if (status == "played") {
                playerInfo.gold += 10;
                cc.sys.localStorage.setItem("playerinfo_gold", playerInfo.gold);
                gameInstance.gameView.updateGold();
                gameInstance.sdkHelper.uploadPlayerInfo();
                this.goldLabel.string = playerInfo.gold + "";
            }
        }.bind(this));
    },
    onBtnExit: function onBtnExit() {
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;

        if (Math.random() < .3) gameInstance.sdkHelper.showAd(1);
    }
});

cc._RF.pop();