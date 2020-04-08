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
        
        head:{
            default:null,
            type:cc.Node,
        },
        body:{
            default:null,
            type:cc.Node,
        },
        body1:{
            default:null,
            type:cc.Node,
        },
        bottom:{
            default:null,
            type:cc.Node,
        },
        hit:{
            default:false,
            visible:false,
        },
        speed:{
            default:1,
            visible:false,
        },
        skinName:{
            default:[],
            visible:false,
        },
        bodyFrame:{
            default:null,
            visible:false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.skinName = ["target1","target_balloon","target_glass","target_wood"];
        this.bodyFrame = this.body.getComponent(cc.Sprite).spriteFrame;
    },

    start () {
    },
    
    init(info, index){
        this.body.height = info.height;
        this.body.scale = 1;
        this.index = index;
        this.moveY = info.moveY;
        this.moveDir = info.moveDir;
        this.speed = info.speed;
        this.penetratable = info.penetratable;
        this.awardGold = info.awardGold;
        this.awardArrow = info.awardArrow;
        this.awardTime = info.awardTime;
        this.skinType = info.skinType;
        this.mustShoot = info.mustShoot;
        this.updateSkin();
        this.setHeadPos();
        this.node.position = cc.v2(info.startX, this.node.position.y);
        this.body.parent.rotation = 0;
        this.node.zIndex = 6 - index;
        this.head.active = true;
        this.body.active = true;
        this.bottom.active = true;
        if(info.movenable == "true") this.move();
    },

    updateSkin(){
        let frame = gameInstance.gameView.ui_main.getSpriteFrame(this.skinName[this.skinType - 1])
        this.head.getComponent(cc.Sprite).spriteFrame = frame;
       
        this.head.width = frame._rect.width;
        this.head.height = frame._rect.height;

        if(this.skinType == 2){
            this.body.getComponent(cc.Sprite).spriteFrame = gameInstance.gameView.whiteFrame;
            this.body.width = 2;
            this.body1.active = false;
        }
        else{
            this.body.getComponent(cc.Sprite).spriteFrame = this.bodyFrame;
            this.body.width = this.bodyFrame._rect.width;
            this.body1.active = true;
        }
    },
    
    explode(){
        if(this.skinType == 1) return;
        this.head.active = false;
        let gameView = gameInstance.gameView;
        let go = cc.instantiate(gameView.booms[this.skinType - 2].node);
        go.parent = this.head.parent;
        go.position = this.head.position;
        go.active = true;
        if(this.skinType == 2) {
            gameInstance.soundManager.playSound("ballon");
            this.body.active = false;
            this.bottom.active = false;

            let pos = this.head.convertToWorldSpaceAR(cc.v2(0,0));
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
        go.parent = this.head.parent;
        go.position = this.head.position;
        go.active = true;
    },

    move(){
        this.moving = true;
        this.body.stopAllActions();
        let offset = this.moveY / this.body.height;
        this.body.runAction(cc.sequence(
                cc.scaleTo(1 / this.speed,1,1 + this.moveDir * offset).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    this.body.runAction(cc.repeatForever(cc.sequence(
                        cc.scaleTo(2 / this.speed,1,1 - this.moveDir * offset).easing(cc.easeSineInOut()),
                        cc.scaleTo(2 / this.speed,1,1 + this.moveDir * offset).easing(cc.easeSineInOut()),
                    )))
                }.bind(this))
            )
        )
    },

    pauseMove(){
        this.body.pauseAllActions();
    },

    resumeMove(){
        this.body.resumeAllActions();
    },

    stopMove(){
        this.moving = false;
        this.body.stopAllActions();
    },

    update(){
        if(this.moving){
            this.setHeadPos();
        }
    },

    updateMask(){
        let pos = this.head.convertToWorldSpaceAR(cc.v2(0,0));
        let mask = gameInstance.gameView.targetsMask[this.index];
        mask.position = mask.parent.convertToNodeSpaceAR(pos);
        mask.active = true;
    },

    setHeadPos(){
        this.head.position = cc.v2(this.head.position.x, this.body.height * this.body.scaleY);
        this.body1.position = cc.v2(this.body1.position.x, this.head.position.y - this.head.height / 2);
    },

    rock(){
        this.rocking = true;
        this.body.parent.runAction(cc.sequence(
            cc.rotateBy(.2,-4 / 2).easing(cc.easeSineOut()),
            cc.rotateBy(.2,7 / 2).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,-5 / 2).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,3 / 2).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,-1 / 2).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                this.rocking = false;
            }.bind(this))
        ))
    },
});
