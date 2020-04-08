"use strict";
cc._RF.push(module, '83d57LzIiVAao5GgNvMSOoV', 'SoundManager');
// script/game/SoundManager.js

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
        isSoundOpen: {
            default: true,
            visible: false
        },
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        bgm1: {
            type: cc.AudioClip,
            default: null
        },
        bgm2: {
            type: cc.AudioClip,
            default: null
        },
        btn: {
            type: cc.AudioClip,
            default: null
        },
        clock: {
            type: cc.AudioClip,
            default: null
        },
        hit1: {
            type: cc.AudioClip,
            default: null
        },
        hit2: {
            type: cc.AudioClip,
            default: null
        },
        shoot: {
            type: cc.AudioClip,
            default: null
        },
        walk1: {
            type: cc.AudioClip,
            default: null
        },
        walk2: {
            type: cc.AudioClip,
            default: null
        },
        ballon: {
            type: cc.AudioClip,
            default: null
        },
        glass: {
            type: cc.AudioClip,
            default: null
        },
        clockId: {
            default: -1,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    playBg: function playBg() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        this.audioSource.clip = this["bgm" + type];
        this.audioSource.loop = true;
        if (this.isSoundOpen) {
            this.audioSource.play();
        }
    },
    playSound: function playSound(name) {
        if (this.isSoundOpen) {
            cc.audioEngine.playEffect(this[name], false);
        }
    },
    playClock: function playClock() {
        if (this.isSoundOpen) {
            var fn = function () {
                var id = cc.audioEngine.playEffect(this.clock, false);
                this.clockId = id;
            }.bind(this);
            fn();
            this.schedule(fn, 4.056);
        }
    },
    stopClock: function stopClock() {
        if (this.clockId != -1) cc.audioEngine.stopEffect(this.clockId);
        this.unscheduleAllCallbacks();
    },
    setSoundOpen: function setSoundOpen(open) {
        this.isSoundOpen = open;
        playerInfo.isSoundOpen = open;
        cc.sys.localStorage.setItem("playerinfo_issoundopen", open ? "true" : "false");
        if (open) {
            this.playBg();
        } else {
            this.audioSource.stop();
        }
    }
});

cc._RF.pop();