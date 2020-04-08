"use strict";
cc._RF.push(module, '69f20UWSvlHPZD58+ABARMi', 'LvProgressBar');
// script/view/LvProgressBar.js

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
            type: [require("LvProgressItem")]
        },
        curIndex: {
            default: 0,
            visible: false
        },
        buleCircle: {
            default: null,
            type: cc.SpriteFrame
        },
        yelloCircle: {
            default: null,
            type: cc.SpriteFrame
        },
        buleRect: {
            default: null,
            type: cc.SpriteFrame
        },
        yelloRect: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    init: function init(index) {
        var start = parseInt(index / 5);
        for (var i = 0; i < 3; ++i) {
            var item = this.items[i];
            item.labeles[0].string = "" + (i + 1 + start);
            item.node.zIndex = i;
            this.items[i].node.getComponent(cc.Sprite).enabled = i == 0;
        }
    },
    updateProgress: function updateProgress() {
        var level = gameInstance.gameView.levelIndex;
        var n = level % 5;
        if (n == 0) {
            var item = this.items[this.curIndex];
            item.boxes[4].spriteFrame = this.yelloRect;
            this.curIndex++;
            if (this.curIndex > 2) this.curIndex = 0;
            this.move();
        } else {
            var _item = this.items[this.curIndex];
            _item.boxes[0].spriteFrame = this.yelloCircle;

            for (var i = 1; i < n; ++i) {
                _item.boxes[i].spriteFrame = this.yelloRect;
            }
        }
    },
    move: function move() {
        var _this = this;

        var _loop = function _loop(i) {
            var item = _this.items[i];
            item.node.getComponent(cc.Sprite).enabled = true;
            item.node.runAction(cc.sequence(cc.moveBy(.5, cc.v2(-302, 0)).easing(cc.easeQuadraticActionOut()), cc.callFunc(function () {

                if (item.node.x < -150) {
                    var level = gameInstance.gameView.levelIndex;
                    item.node.x = 604;
                    var n = parseInt(level / 5);
                    item.labeles[0].string = n + 3 + "";
                    item.boxes[0].spriteFrame = this.buleCircle;
                    item.node.zIndex = n + 2;
                    for (var j = 1; j < item.boxes.length; ++j) {
                        item.boxes[j].spriteFrame = this.buleRect;
                    }
                }

                item.node.getComponent(cc.Sprite).enabled = this.curIndex == i;
            }.bind(_this))));
        };

        for (var i = 0; i < this.items.length; ++i) {
            _loop(i);
        }
    },
    reset: function reset() {
        this.curIndex = 0;
        for (var i = 0; i < this.items.length; ++i) {
            var _item2 = this.items[i];
            _item2.node.x = i * 302;
            _item2.boxes[0].spriteFrame = this.buleCircle;
            for (var j = 1; j < _item2.boxes.length; ++j) {
                _item2.boxes[j].spriteFrame = this.buleRect;
            }
        }
    }
});

cc._RF.pop();