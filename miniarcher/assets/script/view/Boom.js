// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Utils = require("../Utils/Utils");

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
        boomPiecesArr:{
            default:[],
            type:[cc.Node],
        },
        type:{
            default:0,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.boom();
    },
    
    boom () {
        if(this.type == 0){
            let time = .2 + Math.random() *.1;
            this.node.runAction(cc.sequence(
                cc.delayTime(time * .7),
                cc.fadeOut(time * .3)
            ));
            for (var i = 0; i < this.boomPiecesArr.length; i++) {
                var heartPiece = this.boomPiecesArr[i];

                let angle = Utils.getS2TAngle(0,heartPiece.x, 0, heartPiece.y, 1);
                angle += (Math.random() - 0.5) * Math.random() * 20;
                let offset = Math.random() * 50 + 80;
                let x = heartPiece.x - Math.cos(Utils.getRad(angle)) * offset;
                let y = heartPiece.y + Math.sin(Utils.getRad(angle)) * offset;
                heartPiece.runAction(
                    cc.spawn(
                        cc.moveTo(time,cc.v2(x, y)).easing(cc.easeCircleActionOut()),
                        cc.scaleTo(time, .1)
                    )
                )
            }
        }
        else{
            let time = .3 + Math.random() *.2;
            this.node.runAction(cc.sequence(
                cc.delayTime(time * .5),
                cc.fadeOut(time * .5)
            ));
            for (var i = 0; i < this.boomPiecesArr.length; i++) {
                var heartPiece = this.boomPiecesArr[i];

                let angle = Utils.getS2TAngle(0,heartPiece.x, 0, heartPiece.y, 1);
                angle += (Math.random() - 0.5) * Math.random() * 20;
                let offset = Math.random() * 10 + 40;
                let x = heartPiece.x - Math.cos(Utils.getRad(angle)) * offset;
                let y = heartPiece.y + Math.sin(Utils.getRad(angle)) * offset;

                heartPiece.runAction(
                    cc.spawn(
                        cc.moveTo(time,cc.v2(x, y)).easing(cc.easeCircleActionOut()),
                        cc.moveBy(time,cc.v2(0, -200)).easing(cc.easeCubicActionIn()),
                        cc.rotateBy(time,(Math.random() - 0.5) * 2 * (Math.random() * 100 + 100)).easing(cc.easeCircleActionOut()),
                    )
                )
            }
        }
    },
});
