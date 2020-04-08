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
        scoreLabel:{
            default:null,
            type:cc.Label,
        },
        higScoreLabel:{
            default:null,
            type:cc.Label
        },
        noArrow:{
            default:null,
            type:cc.Node,
        },
        noTime:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    
    init(){
        this.scoreLabel.string = ""+gameInstance.gameView.score;
        this.higScoreLabel.string = ""+playerInfo.highScore;
        if(gameInstance.gameView.modelType == 0) {
            this.noArrow.active = true;
            this.noTime.active = false;
        }
        else if(gameInstance.gameView.modelType == 1){
            this.noArrow.active = false;
            this.noTime.active = true;
        }

        let no = gameInstance.gameView.modelType == 0 ? this.noArrow : this.noTime;
        no.stopAllActions();
        no.runAction(
            cc.sequence(
                cc.scaleTo(.1, .9).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    no.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.scaleTo(.2, 1.1).easing(cc.easeSineInOut()),
                                cc.scaleTo(.2, .9).easing(cc.easeSineInOut())
                            )
                        )
                    )
                }.bind(this))
            ),
            
        )

        gameInstance.sdkHelper.showAd(0);
    },

    onBtnHome(){
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;
        gameInstance.gameView.reset();
        gameInstance.startView.node.active = true;
        gameInstance.startView.init();

        gameInstance.sdkHelper.showAd(0);
    },

    onBtnShare(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.sdkHelper.share()
    },
    
});
