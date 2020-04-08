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
        new:{
            default:null,
            type:cc.Node,
        },
        skinSpr:{
            default:null,
            type:cc.Sprite,
        },
        index:{
            default:0,
            visible:false,
        },
        ui_skin:{
            default:null,
            type:cc.SpriteAtlas,
        },
        btnPlay:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    
    init(){
        let skinList = JSON.parse(playerInfo.skinList);
        let shopList = JSON.parse(playerInfo.shopList);
        let hasNum = 0;
        for(let i = 0; i < skinList.length; ++i)
            if(skinList[i] == 1) hasNum++;
        if(hasNum == skinList.length) return false;

        while(true){
            let index = parseInt(Math.random() * 9);
            if(skinList[shopList[index] - 1] == 1) continue;

            this.skinSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p"+shopList[index]);
            this.index = index;
            break;
        }

        this.btnPlay.stopAllActions();
        this.btnPlay.scale = 1;
        this.btnPlay.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(.1),
            cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)),
            cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)),
            cc.scaleTo(0.1, 1.2).easing(cc.easeQuadraticActionOut(3)),
            cc.scaleTo(0.1, 1.1).easing(cc.easeQuadraticActionIn(3)),
            cc.delayTime(2),
        )))

        return true;
    },

    onBtnPlay(){
        gameInstance.soundManager.playSound("btn");
        gameInstance.sdkHelper.showAd(2,function(status){
            if(status == "played"){
                let skinList = JSON.parse(playerInfo.skinList);
                let shopList = JSON.parse(playerInfo.shopList);
                skinList[shopList[this.index] - 1] = 1;
                playerInfo.skinList = JSON.stringify(skinList);
                cc.sys.localStorage.setItem("playerinfo_skinlist",playerInfo.skinList);
    
                let no = playerInfo.useSkin;
                playerInfo.useSkin = shopList[this.index];
                cc.sys.localStorage.setItem("playerinfo_useskin",playerInfo.useSkin);
                shopList[this.index] = no;
                
                playerInfo.shopList = JSON.stringify(shopList);
                cc.sys.localStorage.setItem("playerinfo_shoplist",playerInfo.shopList);
    
                gameInstance.gameView.player.updateSkin();
                gameInstance.startView.updateSkinNum();
    
                gameInstance.gotSkinView.node.active = true;
                gameInstance.gotSkinView.init(shopList[this.index], 2);
                this.node.active = false;

                gameInstance.sdkHelper.uploadPlayerInfo();
            }
        }.bind(this));
    },

    onBtnClose(){
        gameInstance.soundManager.playSound("btn");
        this.node.active = false;
        gameInstance.gameView.state = "running";
    },

});
