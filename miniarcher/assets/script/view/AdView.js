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
        arrow:{
            default:null,
            type:cc.Node,
        },

        time:{
            default:null,
            type:cc.Node,
        },

        btnPlay:{
            default:null,
            type:cc.Node,
        },
        btnSkip:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    
    init(){
        if(gameInstance.gameView.modelType == 0){
            this.arrow.active = true;
            this.time.active = false;
        }
        else{
            this.arrow.active = false;
            this.time.active = true;
        }

        this.btnPlay.stopAllActions();
        this.btnSkip.stopAllActions();
        this.btnSkip.opacity = 0;
        this.btnPlay.scale = 1;
        this.btnPlay.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(.1),
            cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)),
            cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)),
            cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)),
            cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)),
            cc.delayTime(2),
        )))
            
        this.scheduleOnce(function(){
            this.btnSkip.runAction(cc.fadeIn(.3))
        }.bind(this), 2)
    },

    onBtnPlay(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.sdkHelper.showAd(2,function(status){
            if(status == "played"){
                gameInstance.gameView.revive();
                this.node.active = false;
            }
        }.bind(this));
    },

    onBtnSkip(){
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;
        gameInstance.overView.node.active = true;
        gameInstance.overView.init();
    },
});
