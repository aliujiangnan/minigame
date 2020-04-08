"use strict";
cc._RF.push(module, '42330vAs2tN36X10DCs2905', 'GameManager');
// script/game/GameManager.js

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

var isEmpty = function isEmpty(s) {
    return s == "" || s == null;
};
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
        canvas: {
            default: null,
            type: cc.Canvas
        },
        levelesInfo: {
            default: [],
            visible: false
        },
        soundManager: {
            default: null,
            type: require("SoundManager")
        },
        gameView: {
            default: null,
            type: require("GameView")
        },
        startView: {
            default: null,
            type: require("StartView")
        },
        pauseView: {
            default: null,
            type: require("PauseView")
        },
        adView: {
            default: null,
            type: require("AdView")
        },
        overView: {
            default: null,
            type: require("OverView")
        },
        shopView: {
            default: null,
            type: require("ShopView")
        },
        awardView: {
            default: null,
            type: require("AwardView")
        },
        gotSkinView: {
            default: null,
            type: require("GotSkinView")
        },
        rankView: {
            default: null,
            type: require("RankView")
        },
        isWeChat: {
            default: false,
            visible: false
        },
        sdkHelper: {
            default: null,
            type: require("SDKHelper")
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        window.gameInstance = this;

        cc.loader.loadRes("conf/levelesInfo", function (err, results) {
            this.levelesInfo = results.json;
            this.startView.init();
        }.bind(this));

        this.sdkHelper.login();
        this.initPlayerInfo();
    },
    start: function start() {},


    // update (dt) {},

    initPlayerInfo: function initPlayerInfo() {
        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_gold"))) cc.sys.localStorage.setItem("playerinfo_gold", playerInfo.gold);
        playerInfo.gold = parseInt(cc.sys.localStorage.getItem("playerinfo_gold"));

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_highscore"))) cc.sys.localStorage.setItem("playerinfo_highscore", playerInfo.highScore);
        playerInfo.highScore = parseInt(cc.sys.localStorage.getItem("playerinfo_highscore"));

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_skinlist"))) cc.sys.localStorage.setItem("playerinfo_skinlist", playerInfo.skinList);
        playerInfo.skinList = cc.sys.localStorage.getItem("playerinfo_skinlist");

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_shoplist"))) cc.sys.localStorage.setItem("playerinfo_shoplist", playerInfo.shopList);
        playerInfo.shopList = cc.sys.localStorage.getItem("playerinfo_shoplist");

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_useskin"))) cc.sys.localStorage.setItem("playerinfo_useskin", playerInfo.useSkin);
        playerInfo.useSkin = parseInt(cc.sys.localStorage.getItem("playerinfo_useskin"));

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_issoundopen"))) cc.sys.localStorage.setItem("playerinfo_issoundopen", playerInfo.isSoundOpen);
        playerInfo.isSoundOpen = cc.sys.localStorage.getItem("playerinfo_issoundopen");

        if (isEmpty(cc.sys.localStorage.getItem("playerinfo_lastlevelindex"))) cc.sys.localStorage.setItem("playerinfo_lastlevelindex", playerInfo.lastLevelIndex);
        playerInfo.lastLevelIndex = parseInt(cc.sys.localStorage.getItem("playerinfo_lastlevelindex"));

        this.soundManager.setSoundOpen(playerInfo.isSoundOpen == "true");
    }
});

cc._RF.pop();