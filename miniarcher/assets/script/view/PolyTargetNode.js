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
        length:{
            default:450,
            visible:false,
        },
        index:{
            default:0,
            visible:false,
        },
        skinName:{
            default:[],
            visible:false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.skinName = ["target1","target_balloon","target_glass","target_wood"];
    },

    start () {
    },
    
    init(info, index){
        this.node.position = cc.v2(cc.v2(info.startX, info.startY));
        this.speed = info.speed;
        this.penetratable = info.penetratable;
        this.awardGold = info.awardGold;
        this.awardArrow = info.awardArrow;
        this.awardTime = info.awardTime;
        this.skinType = info.skinType;
        this.mustShoot = info.mustShoot;
        this.index = index;
        this.node.zIndex = 10 - index;
        this.node.opacity = 255;
        this.updateSkin();
        this.move();
        // console.log("startMove");
    },

    updateSkin(){
        let frame = gameInstance.gameView.ui_main.getSpriteFrame(this.skinName[this.skinType - 1])
        this.node.getComponent(cc.Sprite).spriteFrame = frame;
       
        this.node.width = frame._rect.width;
        this.node.height = frame._rect.height;
    },
    
    explode(){
        if(this.skinType == 1) return;
        this.node.active = false;
        let gameView = gameInstance.gameView;
        let go = cc.instantiate(gameView.booms[this.skinType - 2].node);
        go.parent = this.node.parent;
        go.position = this.node.position;
        go.active = true;
        if(this.skinType == 2) {
            gameInstance.soundManager.playSound("ballon");

            let pos = this.node.convertToWorldSpaceAR(cc.v2(0,0));
            let addArrow = Math.random() > .5;
            let go1 = cc.instantiate(addArrow ? gameView.addArrowNo : gameView.addGoldNo);
            go1.parent = gameView.node;
            go1.position = gameView.node.convertToNodeSpaceAR(pos);
            go1.active = true;
            go1.scale = 1.2;
            go1.runAction(cc.sequence(
                cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()),
                cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()),
                cc.scaleTo(.15, 0.88).easing(cc.easeQuadraticActionInOut()),
                cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()),
                cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()),
                cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()),
                cc.delayTime(.2),
                cc.fadeOut(.5),
            ))

            if(addArrow){
                go1.getChildByName("label").getComponent(cc.Label).string = "" + this.awardArrow;
                gameInstance.gameView.arrowNum += this.awardArrow;
                gameInstance.gameView.updateArrow();
            }
            else{
                go1.getChildByName("label").getComponent(cc.Label).string = "" + this.awardGold;
                playerInfo.gold += this.awardGold;
                cc.sys.localStorage.setItem("playerinfo_gold",playerInfo.gold);
                gameInstance.gameView.updateGold();
                gameInstance.sdkHelper.uploadPlayerInfo();
            }
        }
        else if(this.skinType == 3) gameInstance.soundManager.playSound("glass");
    },

    playPart(index){
        let go = cc.instantiate(gameInstance.gameView.particles[index].node);
        go.parent = this.node.parent;
        go.position = this.node.position;
        go.active = true;
    },


    move(){
        this.moving = true;
        this.node.stopAllActions();
        let info = gameInstance.gameView.getCurLevelInfo();
        let targets = gameInstance.gameView.getCurTargetsInfo();
        if(this.index == targets.length - 1){
            this.index = 0;
            let next = targets[this.index];
            if(next == undefined) return;
            if(info.polyType != 2){
                this.node.runAction(
                    cc.sequence(
                        cc.moveTo(1 / this.speed,cc.v2(next.startX, next.startY)),
                        cc.callFunc(function(){
                            this.move();
                        }.bind(this))
                    )
                )
            }
            else{
                this.node.runAction(
                    cc.sequence(
                        cc.fadeOut(1 / this.speed / 4),
                        cc.delayTime(1 / this.speed / 2),
                        cc.moveTo(0,cc.v2(next.startX, next.startY)),
                        cc.fadeIn(1 / this.speed / 4),
                        cc.callFunc(function(){
                            this.move();
                        }.bind(this))
                    )
                )
            }
        }
        else{
            this.index++;
            let next = targets[this.index];
            if(next == undefined) return;
            this.node.runAction(
                cc.sequence(
                    cc.moveTo(1 / this.speed,cc.v2(next.startX, next.startY)),
                    cc.callFunc(function(){
                        this.move();
                    }.bind(this))
                )
            )
        }        
    },
    
    stopMove(){
        this.moving = false;
        this.node.stopAllActions();
    },

    pauseMove(){
        this.node.pauseAllActions();
    },

    resumeMove(){
        this.node.resumeAllActions();
    },
});
