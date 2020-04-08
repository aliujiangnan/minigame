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
        skinLabel:{
            default:null,
            type:cc.Label,
        },
        settingContent:{
            default:null,
            type:cc.Node,
        },
        settingOpen:{
            default:false,
            visible:false,
        },
        btnSoundClose:{
            default:null,
            type:cc.Node,
        },
        btnSoundOpen:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let i6 = 1334 / 750;
        let windowSize = cc.view.getVisibleSize();
        let cur = windowSize.height / windowSize.width;

        if(cur.toFixed(3) > i6.toFixed(3)){
            let widget = this.settingContent.parent.parent.getComponent(cc.Widget);
            widget.top = 210;
            widget.updateAlignment();
        }
    },
    
    init(){
        
        this.updateSkinNum();
        this.updateSoundBtn();
    },

    updateSkinNum(){
        let skinList = JSON.parse(playerInfo.skinList);
        let hasNum = 0;
        for(let i = 0; i < skinList.length; ++i)
            if(skinList[i] == 1) hasNum++;
        this.skinLabel.string = hasNum + "/10";
    },

    onBtnSetting(){
        gameInstance.soundManager.playSound("btn");
        if(!this.settingOpen) this.settingContent.active = true;
        this.settingContent.stopAllActions();
        this.settingContent.runAction(cc.sequence(
                cc.moveTo(.3,cc.v2(0,this.settingOpen ? 200 : 0)).easing(cc.easeQuadraticActionOut()),
                cc.callFunc(function(){
                    this.settingOpen = !this.settingOpen;
                    if(!this.settingOpen) this.settingContent.active = false;
                }.bind(this))
            )
        )
    },

    onBtnSound(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.soundManager.setSoundOpen(!gameInstance.soundManager.isSoundOpen);
        this.updateSoundBtn();
    },

    updateSoundBtn(){
        this.btnSoundClose.active = gameInstance.soundManager.isSoundOpen;
        this.btnSoundOpen.active = !gameInstance.soundManager.isSoundOpen;
    },

    onBtnLock(){
        gameInstance.soundManager.playSound("btn");
    },

    onBtnStart(eve, data){
        let index = JSON.parse(data);
        if(index > 1) return;
        gameInstance.soundManager.playSound("btn");
        gameInstance.gameView.startGame(index);
        this.node.active = false;
    },

    onBtnShop(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.shopView.node.active = true;
        gameInstance.shopView.init();
    },

    onBtnRank(){
        gameInstance.soundManager.playSound("btn");
        this.onRankCallback();
    },

    onRankCallback(){

        this.node.active = false;
        gameInstance.rankView.node.active = true;
        gameInstance.rankView.init();
    }
});
