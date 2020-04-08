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
        rankContent:{
            type:require("RankContent"),
            default:null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    init(){
        gameInstance.gameView.goldLabel.node.parent.active = false;
        gameInstance.sdkHelper.showRank(function(data){
            this.rankContent.init(data);
        }.bind(this));
    },

    onBtnChallenge(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.gameView.goldLabel.node.parent.active = false;

        gameInstance.sdkHelper.share(
            "有一种梦想叫『称霸朋友圈』，别迷恋哥，哥只是个传说。",
            "https://miniarcher-1256660609.cos.ap-chengdu.myqcloud.com/share/archery.png",
            null,
            null)
    },

    onBtnClose(){
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;
        gameInstance.startView.node.active = true;
        gameInstance.gameView.goldLabel.node.parent.active = true;

    },
});
