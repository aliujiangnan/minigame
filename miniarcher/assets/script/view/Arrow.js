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
        moving:{
            default:false,
            visible:false,
        },
        speed:{
            default:0,
            visible:false,
        },
        gravity:{
            default:-10,
            visible:false,
        },
        time:{
            default:0,
            visible:false,
        },
        startPos:{
            default:cc.v2(0,0),
            visible:false,
        },
        anchor:{
            default:null,
            type:cc.Node,
        },
        anchor1:{
            default:null,
            type:cc.Node,
        },
        hitX:{
            default:null,
            type:cc.Node,
        },
        hitXs:{
            default:[],
            type:[cc.Node],
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gravity = -50;
    },

    start () {
    },

    update (dt) {
        
    },

    phyUpdate(){
        if(this.moving){
            this.time += 0.01;
            let lastPos = this.node.position;
            this.node.position = cc.v2(
                this.startPos.x + this.speed * 60 * this.time * Math.cos(Utils.getRad(this.angle)),
                this.startPos.y + this.speed * 60 * this.time * Math.sin(Utils.getRad(this.angle)) + 0.5 * this.gravity * this.time  * this.time * 100
            );
            
            let angle = Utils.getS2TAngle(this.node.position.x, lastPos.x, this.node.position.y, lastPos.y, 1);
            this.node.rotation = angle;
            
            let anchorPos = this.anchor.convertToWorldSpaceAR(cc.v2(0,0));
            
            if(this.node.position.x > 400){
                gameInstance.gameView.player.shootEnable = true;
            }

            if(this.node.position.x > 500){
                this.moving = false;
                this.node.parent = null;
                if(gameInstance.gameView.arrowNum == 0) gameInstance.gameView.gameOver();
            }
            else if(anchorPos.y - gameInstance.canvas.node.height / 2 < - 250){
                this.moving = false;
                let content = gameInstance.gameView.roadContents[gameInstance.gameView.curIndex];
                this.node.parent = content;
                this.node.position = content.convertToNodeSpaceAR(anchorPos);
                this.node.anchorX = 1;
                this.ground();
                gameInstance.gameView.player.shootEnable = true;
                if(gameInstance.gameView.arrowNum == 0) gameInstance.gameView.gameOver();
            }

            let infos = gameInstance.gameView.getCurLevelInfo();
            let targetsInfo = gameInstance.gameView.getCurTargetsInfo();
            let length = infos.polyType != 0 ? 10 : 3;
            for(let i = 0; i < targetsInfo.length; ++i){
                let targets = infos.polyType != 0 ? gameInstance.gameView.polyTargets : gameInstance.gameView.targets;
                let target =  targets[gameInstance.gameView.curIndex * length + i];
                if(!target.node.active) continue;

                let targetNode = infos.polyType != 0 ? target.node : target.head;
                let targetPos = targetNode.convertToWorldSpaceAR(cc.v2(0,0));
                let anchorPos1 = this.anchor1.convertToWorldSpaceAR(cc.v2(0,0));
                
                let height = targetNode.height;
                if(
                    anchorPos.x > targetPos.x - 40 &&
                    anchorPos1.x < targetPos.x - 40 &&
                    anchorPos.y > targetPos.y - height / 2 && 
                    anchorPos.y < targetPos.y + height / 2
                    ){
                                                            
                    let no = cc.instantiate(this.hitX);
                    no.parent = targetNode;
                    no.position = targetNode.convertToNodeSpaceAR(anchorPos);
                    let offsetX = -3 - no.x;
                    let offsetY = offsetX * Math.tan(Utils.getRad(360 - this.node.rotation));
                    no.position = cc.v2(-3, no.y + offsetY);
                    no.active = true;
                    this.hitXs.push(no);
                    if(target.penetratable == "false"){
                        this.moving = false;
                        this.node.parent = targetNode;
                        this.node.position = no.position;
                        this.node.anchorX = 1;
                        this.rock();
                        if(infos.polyType == 0)target.rock();
                        gameInstance.soundManager.playSound("hit2");
                    }
                    else if(!target.hit){
                        target.explode();
                    }
                    
                    if(!target.hit){
                        if(target.mustShoot == "true"){
                            let score = 10;
                            let offset = Math.abs(no.y);
                            let index = 2;
                            if(offset < height / 7 * 0.5){
                                score = 30;
                                index = 0;
                                gameInstance.soundManager.playSound("hit1");
                            }
                            else if(offset < height / 7 * 1.5){
                                score = 20;
                                index = 1;
                            }
                            else if(offset < height / 7 * 2.5)
                                score = 10;
                            
                            target.hit = true;
                            gameInstance.gameView.curHitNum++;
                            if(target.penetratable == "true" && gameInstance.gameView.curHitNum == gameInstance.gameView.getCurMustShoot()){
                                gameInstance.gameView.move();
                            }
                            if(target.skinType != 2)gameInstance.gameView.addScore(score, target);
                            target.playPart(index);
                            if(index == 0)
                                gameInstance.gameView.showBoomFire();
                        }
                        target.hit = true;
                    }
                }
            }
        }
        else{
            this.unschedule(this.phyUpdate, this);
        }
    },

    shoot(angle, speed){
        this.angle = angle;
        this.speed = speed;
        this.startPos = this.node.position;
        this.moving = true;

        this.schedule(this.phyUpdate, 0.01);
    },

    rock(){
        this.node.runAction(cc.sequence(
            cc.rotateBy(.2,10).easing(cc.easeSineOut()),
            cc.rotateBy(.2,-17.5).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,12.5).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,-7.5).easing(cc.easeSineInOut()),
            cc.rotateBy(.2,2.5).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                if(gameInstance.gameView.arrowNum == 0) gameInstance.gameView.gameOver();

                if(gameInstance.gameView.curHitNum == gameInstance.gameView.getCurMustShoot()){
                    gameInstance.gameView.move();
                }

                gameInstance.gameView.player.shootEnable = true;

            }.bind(this))
        ))
    },

    ground(){
        this.node.runAction(cc.spawn(
            cc.rotateTo(.75,0).easing(cc.easeBounceOut()),
            cc.moveBy(.75,cc.v2(400 * Math.cos(Utils.getRad(this.node.rotation)),0))
        ))
    },

    clearSelf(){
        this.node.parent = null;
        for(let i = 0; i < this.hitXs.length; ++i){
            this.hitXs[i].parent = null;
        }
        this.hitXs = [];
    }
});
