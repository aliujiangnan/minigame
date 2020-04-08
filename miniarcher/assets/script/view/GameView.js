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

        cloudies:{
            default:[],
            type:[cc.Node],
        },
        grasses1:{
            default:[],
            type:[cc.Node],
        },
        grasses2:{
            default:[],
            type:[cc.Node],
        },
        roads:{
            default:[],
            type:[cc.Node],
        },
        roadContents:{
            default:[],
            type:[cc.Node],
        },
        targets:{
            default:[],
            type:[require("Target")],
        },
        polyTargets:{
            default:[],
            type:[require("PolyTargetNode")],
        },
        polyLines:{
            default:[],
            type:[cc.Node],
        },
        polyStands:{
            default:[],
            type:[cc.Node],
        },
        targetsMask:{
            default:[],
            type:cc.Node,
        },
        player:{
            default:null,
            type:require("Player")
        },
        goldLabel:{
            default:null,
            type:cc.Label,
        },
        scoreLabel:{
            default:null,
            type:cc.Label,
        },
        arrowLabel:{
            default:null,
            type:cc.Label,
        },
        btnStart:{
            default:null,
            type:cc.Node,
        },
        btnPause:{
            default:null,
            type:cc.Node,
        },
        addArrow:{
            default:null,
            type:cc.Node,
        },
        addTime:{
            default:null,
            type:cc.Node,
        },
        addScores:{
            default:[],
            type:[cc.Node],
        },
        startPos:{
            default:cc.v2(0,0),
            visible:false,
        },
        curIndex:{
            default:0,
            visible:false,
        },
        abandonArrows:{
            default:[],
            visible:false,
        },
        modelType:{
            default:1, //1数量，2时间
            visible:false,
        },
        score:{
            default:0,
            visible:false,
        },
        levelIndex:{
            default:0,
            visible:false,
        },
        curHitNum:{
            default:0,
            visible:false,
        },
        state:{
            default:"idle",
            visible:false,
        },
        arrowNum:{
            default:14,
            visible:false,
        },
        timeDown:{
            default:30,
            visible:false,
        },
        levelBar:{
            default:null,
            type:require("LevelBar")
        },
        hand:{
            default:null,
            type:cc.Node,
        },
        arrow:{
            default:null,
            type:cc.Node,
        },
        ui_main:{
            default:null,
            type:cc.SpriteAtlas,
        },
        clockIc:{
            default:null,
            type:cc.Node,
        },
        arrowIc:{
            default:null,
            type:cc.Node,
        },
        booms:{
            default:[],
            type:[require("Boom")]
        },
        particles:{
            default:[],
            type:[cc.ParticleSystem]
        },
        whiteFrame:{
            default:null,
            type:cc.SpriteFrame,
        },
        lvProgress:{
            default:null,
            type:require("LvProgressBar")
        },
        firework:{
            default:null,
            type:cc.Node
        },
        fireworks:{
            default:[],
            visible:false
        },
        ui_anim:{
            default:null,
            type:cc.SpriteAtlas,
        },
        curLevelInfo:{
            default:[],
            visible:false,
        },
        reviveChance:{
            default:1,
            visible:false,
        },
        goldIc:{
            default:null,
            type:cc.Node,
        },
        addArrowNo:{
            default:null,
            type:cc.Node,
        },
        addGoldNo:{
            default:null,
            type:cc.Node,
        },
        startLevel:{
            default:0,
            visible:false,
        },
        awarded:{
            default:false,
            visible:false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let i6 = 1334 / 750;
        let windowSize = cc.view.getVisibleSize();
        let cur = windowSize.height / windowSize.width;

        if(cur.toFixed(3) > i6.toFixed(3)){
            let widget = this.btnStart.parent.getComponent(cc.Widget);
            widget.top = 220;
            widget.updateAlignment();
        }

        this.infoTemp = [
            {"parentNo":1,"selfNo":1,"hasBoss":"false","pivotX":0,"pivotY":0,"polyType":0},
            [
                {"startX":0,"startY":0,"height":450,"moveY":100,"moveDir":1,"speed":1,"awardGold":1,"awardArrow":1,"awardTime":2,"skinType":1,"mustShoot":"true","penetratable":"false","movenable":"false"}
            ]
        ],
        this.init();
    },

    start () {
    },

    init(){
        
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onMouseDown(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onMouseMove(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onMouseUp(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onMouseUp(event);
        }, this);

        for(let i = 0; i < this.targetsMask.length; ++i){
            this.targetsMask[i].zIndex = this.targetsMask.length - i;
            if(i == 0){
                this.targetsMask[i].parent.parent.parent.zIndex = 2;
            }
        }
        
        this.player.updateSkin();
        this.updateGold();
    },

    initLevel(){
        let data = this.genLevelInfo();
        let info = data[0];
        let targets = data[1];

        if(info.polyType == 0){
            for(let i = 0; i < targets.length; ++i){
                this.targets[this.curIndex * 3 + i].node.active = true;
                this.targets[this.curIndex * 3 + i].init(targets[i], i);
            }
        }
        else{
            for(let i = 0; i < targets.length; ++i){
                this.polyTargets[this.curIndex * 10 + i].node.active = true;
                this.polyTargets[this.curIndex * 10 + i].init(targets[i], i);
                this.drawLine(info,targets,i);
            }
            this.initStand(info);
        }
    },

    initStand(info){
        let stand = this.polyStands[this.curIndex];
        stand.x = info.pivotX;
        stand.height = info.pivotY - stand.y;
        stand.active = true;
    },

    drawLine(info, targets, index){
        if(info.polyType == 2 && index == targets.length - 1){
            return;
            
        }
        
        let cur = targets[index];
        let next = index == targets.length - 1 ? targets[0] : targets[index + 1];
        let anchorY = 0.11 * 117;
        let length = anchorY * 2 + Utils.getDistance(cur.startX, next.startX, cur.startY, next.startY);
        let line = gameInstance.gameView.polyLines[this.curIndex * 10 + index];
        line.active = true;
        line.position = cc.v2(cur.startX, cur.startY);
        line.height = length;
        line.anchorY = anchorY / length;
        line.rotation = Utils.getS2TAngle(cur.startX, next.startX, cur.startY, next.startY, 1) - 90;
    },

    getCurLevelInfo(){
        if(this.modelType == 0)
            return gameInstance.levelesInfo[this.levelIndex > 59 ? this.randLevelIndex : this.levelIndex][0];
        else 
            return this.curLevelInfo[0];
    },

    getCurTargetsInfo(){
        if(this.modelType == 0)
            return gameInstance.levelesInfo[this.levelIndex > 59 ? this.randLevelIndex : this.levelIndex][1];
        else
            return this.curLevelInfo[1];
    },

    genLevelInfo(){
        if(this.modelType == 0){
            let index = this.levelIndex;
            if(index > 59){
                index = parseInt(Math.random() * 60);
                this.randLevelIndex = index;
            }

            return gameInstance.levelesInfo[index];
        }
        else{
            let data = this.infoTemp;
            let info = data[0];
            let targets = data[1];
            info.parentNo = parseInt(this.levelIndex / 5) + 1;
            info.selfNo = this.levelIndex % 5 + 1;
            this.curLevelInfo.push(info);
            targets[0].height = Math.random() * 500 + 250;
            targets[0].startX = (Math.random() - .5) * 240;

            this.curLevelInfo.push(targets);

            return this.curLevelInfo;
        }
    },

    getCurMustShoot(){
        let n = 0;
        let targets = this.getCurTargetsInfo();
        for(let i = 0; i < targets.length; ++i)
            if(targets[i].mustShoot == "true")
                n++;

        return n;
    },

    update (dt) {
        for(let i = 0; i < this.cloudies.length; ++i){
            this.cloudies[i].position = cc.v2(this.cloudies[i].position.x - 1, 0);
            if(this.cloudies[i].position.x < -this.node.width)
                this.cloudies[i].position = cc.v2(this.node.width, 0);

        }
    },

    startGame(type){
        this.modelType = type;
        switch(type){
            case 0:
                this.arrowNum = playerInfo.maxArrow;
                this.updateArrow();
                this.arrowIc.active = true;
                this.clockIc.active = false;
                break;
            case 1:
                this.timeDown = playerInfo.timeLimit;
                this.arrowLabel.string = "" + this.timeDown;
                this.schedule(this.timeLoop, 1);
                gameInstance.soundManager.playClock();
                this.arrowIc.active = false;
                this.clockIc.active = true;
                break;
            case 2:
                break;
            case 3:
                break;
        }

        this.arrowLabel.node.parent.active = true;
        this.scoreLabel.node.active = true;
        this.btnPause.active = true;
        this.levelIndex = this.modelType == 0 ? parseInt(playerInfo.lastLevelIndex / 5) * 5 : 0;
        
        for(let i = 0; i < 2; ++i){
            let targetParent = this.targets[i * 3].node.parent; 
            targetParent.x = 215 + i * 828;

            let targetParent1 = this.polyTargets[i * 10].node.parent; 
            targetParent1.x = 215 + i * 828;
        }
        
        this.initLevel(this.levelIndex);
        this.lvProgress.init(this.levelIndex);
        this.lvProgress.node.active = this.modelType == 0;
        this.playHand();

        this.startLevel = this.levelIndex;
        this.state = "running";

    },

    playHand(){
        this.hand.stopAllActions();
        this.arrow.stopAllActions();
        this.hand.active = true;
        this.hand.position = cc.v2(110,190);
        this.hand.scale = 1.2;
        this.hand.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(.2,1),
                cc.callFunc(function(){
                    this.arrow.active = true;
                    this.arrow.rotation = 0;
                    this.arrow.scaleX = 0;
                    this.arrow.runAction(cc.scaleTo(.5,1));
                }.bind(this)),
                cc.moveBy(.5,cc.v2(-200,0)),
                cc.delayTime(.3),
                cc.callFunc(function(){
                    this.arrow.runAction(cc.rotateTo(.5,-30).easing(cc.easeSineOut()));
                }.bind(this)),
                cc.moveBy(.5,cc.v2(0,200)).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    this.arrow.runAction(cc.rotateTo(.5,30).easing(cc.easeSineInOut()));
                }.bind(this)),
                cc.moveBy(1.0,cc.v2(0,-400)).easing(cc.easeSineInOut()),
                cc.delayTime(.3),
                cc.callFunc(function(){
                    this.arrow.runAction(cc.scaleTo(.2,0,1));
                }.bind(this)),
                cc.scaleTo(.2,1.2),
                cc.delayTime(1),
                cc.moveBy(.5,cc.v2(200,200))
            )
        ))
    },

    stopHand(){
        this.hand.active = false;
        this.arrow.active = false;
        this.hand.stopAllActions();
        this.arrow.stopAllActions();
    },

    timeLoop(){
        if(this.state!="running") return;
        this.timeDown--;
        this.arrowLabel.string = "" + this.timeDown;
        if(this.timeDown == 0){
            this.gameOver();
            this.unschedule(this.timeLoop);
            gameInstance.soundManager.stopClock();
        }
    },

    gameOver(){
        this.state = "over";
        if(this.reviveChance == 0){
            gameInstance.overView.node.active = true;
            gameInstance.overView.init();
            return;
        }
        this.reviveChance--;
        gameInstance.adView.node.active = true;
        gameInstance.adView.init();
        this.pauseTargets();
    },
    
    revive(){
        if(this.modelType == 0){
            this.arrowNum += 5;
            this.updateArrow();
        }
        else{
            this.timeDown += 15;
            this.arrowLabel.string = "" + this.timeDown;
            this.schedule(this.timeLoop, 1);
            gameInstance.soundManager.playClock();
        }
        this.state = "running";       
        
        this.resumeTargets();

    },

    pauseTargets(){
        for(let i = this.curIndex * 3; i < this.curIndex * 3 + 3; ++i){
            this.targets[i].pauseMove();
        }
        for(let i = this.curIndex * 10; i < this.curIndex * 10 + 10; ++i){
            this.polyTargets[i].pauseMove();
        }
    },

    resumeTargets(){
        for(let i = this.curIndex * 3; i < this.curIndex * 3 + 3; ++i){
            this.targets[i].resumeMove();
        }
        for(let i = this.curIndex * 10; i < this.curIndex * 10 + 10; ++i){
            this.polyTargets[i].resumeMove();
        }
    },

    onBtnStart(){
        gameInstance.soundManager.playSound("btn");
        this.state = "running";
        gameInstance.pauseView.node.active = false;
        this.btnStart.active = false;
        this.btnPause.active = true;
        this.resumeTargets();
        if(this.modelType == 1)
            gameInstance.soundManager.playClock();
    },

    onBtnPause(){
        gameInstance.soundManager.playSound("btn");
        if(!this.player.shootEnable || this.moving) return;
        if(this.modelType == 1 && this.timeDown <= 1) return;
        this.state = "pause";
        gameInstance.pauseView.node.active = true;
        this.btnStart.active = true;
        this.btnPause.active = false;
        this.pauseTargets();
        gameInstance.soundManager.stopClock();
    },

    onMouseDown(event){
        if(this.state != "running") return;
        this.stopHand();
        this.player.putArrow();
        this.startPos = event.getLocation();
    },

    onMouseMove(event){
        if(this.state != "running") return;
        let pos = event.getLocation();
        this.player.aim(this.startPos, pos);
    },

    onMouseUp(event){
        if(this.moving) return;
        if(this.state != "running") return;
        let pos = event.getLocation();
        if(Utils.getDistance(pos.x,this.startPos.x,pos.y,this.startPos.y) < 1) return;
        this.player.shoot();
    },

    updateLevelIndex(){
        this.levelIndex ++;
    },

    move(){
        if(this.moving) return;
        this.moving = true;
        this.player.jump();
        for(let i = 0; i < this.grasses1.length; ++i){
            let grass = this.grasses1[i];            
            grass.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width * .2,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(grass.position.x < -this.node.width + 10){
                        grass.position = cc.v2(this.node.width,0);
                    }

                    this.moving = false;
                }.bind(this))
            ));
        }

        for(let i = 0; i < this.grasses2.length; ++i){
            let grass = this.grasses2[i];            
            grass.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width * .1,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(grass.position.x < -this.node.width + 10){
                        grass.position = cc.v2(this.node.width,0);
                    }
                }.bind(this))
            ));
        }

        for(let i = 0; i < this.roads.length; ++i){
            let road = this.roads[i];            
            road.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(road.position.x < -this.node.width + 10){
                        road.position = cc.v2(this.node.width,0);
                    }
                }.bind(this))
            ));
        }

        for(let i = 0; i < this.roadContents.length; ++i){
            let content = this.roadContents[i];            
            content.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(content.position.x < -this.node.width + 10){
                        content.position = cc.v2(this.node.width,0);
                        this.player.clearArrows();
                    }
                }.bind(this))
            ));
        }

        this.curHitNum = 0;
        this.curIndex = this.curIndex == 0 ? 1 : 0;
        this.updateLevelIndex();
        if(this.modelType == 0){
            playerInfo.lastLevelIndex = this.levelIndex;
            cc.sys.localStorage.setItem("playerinfo_lastlevelindex",playerInfo.lastLevelIndex);
            gameInstance.sdkHelper.uploadPlayerInfo();
        }
        if(this.state == "running" && !this.awarded && this.levelIndex >= this.startLevel + 10 && Math.random() < .33){
            let rst = gameInstance.awardView.init();
            gameInstance.awardView.node.active = rst;
            if(rst)this.state = "pause";
            gameInstance.soundManager.stopClock();
            this.awarded = true;
        }
        this.initLevel(this.levelIndex);
        this.lvProgress.updateProgress();
        for(let i = 0; i < 2; ++i){
            let targetParent = this.targets[i * 3].node.parent; 

            targetParent.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(targetParent.position.x < 215 - this.node.width + 10){
                        targetParent.position = cc.v2(215 + this.node.width,targetParent.position.y);
                        for(let j = i * 3; j < i * 3 + 3; ++j){
                            this.targets[j].node.active = false;
                            this.targets[j].hit = false;
                            this.targets[j].stopMove();
                        }
                    }
                }.bind(this))
            ));

            let targetParent1 = this.polyTargets[i * 10].node.parent; 

            targetParent1.runAction(cc.sequence(
                cc.moveBy(1,cc.v2(-this.node.width,0)).easing(cc.easeQuadraticActionInOut(1.5)),
                cc.callFunc(function(){
                    if(targetParent1.position.x < 215 - this.node.width + 10){
                        targetParent1.position = cc.v2(215 + this.node.width,targetParent1.position.y);
                        for(let j = i * 10; j < i * 10 + 10; ++j){
                            this.polyTargets[j].node.active = false;
                            this.polyTargets[j].hit = false;
                            this.polyTargets[j].stopMove();
                            this.polyLines[j].active = false;
                        }
                        this.polyStands[i].active = false;

                    }
                }.bind(this))
            ));
        }
    },

    addScore(score, target){
        let index = 0;
        let node = target.head == null ? target.node : target.head;
        if(score == 30){ 
            index = 2;
            playerInfo.gold += target.awardGold;
            cc.sys.localStorage.setItem("playerinfo_gold",playerInfo.gold);
            gameInstance.sdkHelper.uploadPlayerInfo();
            this.updateGold();
            this.addLife(target);

            let go1 = cc.instantiate(this.goldIc);
            let pos = node.convertToWorldSpaceAR(cc.v2(-60, 160,0));
            go1.position = cc.v2(pos.x - this.node.width / 2, pos.y - cc.view.getVisibleSize().height / 2 - 100);
            go1.parent = this.node;
            go1.active = true;
            go1.runAction(cc.sequence(
                cc.delayTime(.0),
                cc.spawn(
                    cc.moveBy(.5,cc.v2(-100,0)),
                    cc.sequence(
                        cc.moveBy(.2,cc.v2(0,50)).easing(cc.easeQuadraticActionOut()),
                        cc.moveBy(.3,cc.v2(0,-100)).easing(cc.easeQuadraticActionIn()),
                    ),
                    cc.fadeOut(.5),
                )
            ))

        }
        else if(score == 20) index = 1;
        let go = cc.instantiate(this.addScores[index]);
        let pos = node.convertToWorldSpaceAR(cc.v2(0,0));
        go.position = cc.v2(pos.x - this.node.width / 2, pos.y - cc.view.getVisibleSize().height / 2 - 100);
        go.parent = this.node;
        go.active = true;
        go.scale = 1.2;
        go.runAction(cc.sequence(
            cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 0.88).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()),
            cc.delayTime(.2),
            cc.fadeOut(.5),
        ))
        
        this.score += score;
        this.scoreLabel.string = ""+this.score;
        if(this.score > playerInfo.highScore){
            playerInfo.highScore = this.score;
            cc.sys.localStorage.setItem("playerinfo_highscore",playerInfo.highScore);
            gameInstance.sdkHelper.uploadScore(score);
            
        }
    },

    addLife(target){
        let go = cc.instantiate(this.modelType == 0 ? this.addArrow : this.addTime);
        go.position = this.addArrow.position;
        go.parent = this.addArrow.parent;
        go.active = true;
        go.scale = 1.2;
        go.runAction(cc.sequence(
            cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 0.88).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()),
            cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()),
            cc.delayTime(.2),
            cc.fadeOut(.5),
        ))

        if(this.modelType == 0){
            this.arrowNum += target.awardArrow;
            this.updateArrow();
        }
        else{
            this.timeDown += target.awardTime;
            this.arrowLabel.string = "" + this.timeDown;
        }
    },

    updateGold(){
        this.goldLabel.string = "" + playerInfo.gold;
    },

    updateArrow(){
        this.arrowLabel.string = "" + this.arrowNum;
    },

    resetTargets(){
        for(let i = 0; i < this.targets.length; ++i){
            this.targets[i].node.active = false;
            this.targets[i].hit = false;
            this.targets[i].stopMove();
        }
        for(let i = 0; i < this.polyTargets.length; ++i){
            this.polyTargets[i].node.active = false;
            this.polyTargets[i].hit = false;
            this.polyTargets[i].stopMove();
        }
    },

    reset(){
        this.awarded = false;
        this.startLevel = 0;
        this.curIndex = 0;
        this.levelIndex = 0;
        this.score = 0;
        this.arrowNum = 14;
        this.timeDown = 30;
        this.reviveChance = 1;
        this.curHitNum = 0;
        this.scoreLabel.string = "0";
        this.arrowLabel.node.parent.active = false;
        this.scoreLabel.node.active = false;
        this.btnStart.active = false;
        this.btnPause.active = false;
        this.curLevelInfo = [];
        this.player.reset();
        this.moving = false;
        this.lvProgress.reset();
        this.lvProgress.node.active = false;
        this.resetTargets();
        this.stopHand();
        this.unschedule(this.timeLoop);
        gameInstance.soundManager.stopClock();
        this.targets[0].node.parent.position = cc.v2(215,this.targets[0].node.parent.position.y);
        this.targets[3].node.parent.position = cc.v2(1043,this.targets[0].node.parent.position.y);
        this.polyTargets[0].node.parent.position = cc.v2(215,this.polyTargets[0].node.parent.position.y);
        this.polyTargets[10].node.parent.position = cc.v2(1043,this.polyTargets[0].node.parent.position.y);
    },

    showBoomFire(){
        for (let i = 0; i < 30; i++) {
            this.scheduleOnce(function(){
            let go = this.getFirework();
            go.position = cc.v2(424,cc.view.getVisibleSize().height / 2);
            go.active = true;
            go.parent = this.node;
            let x = Math.random()*1080-540;
            let ran = Math.random() *0.5+0.5;
            go.runAction(
                    cc.spawn(
                        cc.moveTo(ran,cc.v2(x,Math.random()*1080-360)),
                        cc.rotateTo(ran,90),
                        cc.sequence(
                            cc.delayTime(ran * .7),
                            cc.fadeTo(ran * .3, 0),
                        ),
                    ),           
            )
           }.bind(this),i*0.01);
        }

        for (let i = 0; i < 30; i++) {
            this.scheduleOnce(function(){
            let go = this.getFirework();
            go.position = cc.v2(-424,cc.view.getVisibleSize().height / 2);
            go.active = true;
            go.parent = this.node;
            let x = Math.random()*1080-540;
            let ran = Math.random() *0.5+0.5;
            let time = Math.random()*1+1;
            go.runAction(
                    cc.spawn(
                        cc.moveTo(ran,cc.v2(x,Math.random()*1080-360)),
                        cc.rotateTo(ran,90),
                        cc.sequence(
                            cc.delayTime(ran * .7),
                            cc.fadeTo(ran * .3, 0),
                        ),
                    ),              
            )
           }.bind(this),i*0.01);
        }
    },

    showFirework(){
        for (let j = 0; j < 5; j++) {
            this.scheduleOnce(function(){
                let go = this.getFirework();
                go.active = true;
                go.parent = this.node;
                go.position = cc.v2( Math.random()*1080 - 540 , Math.random()*40 +900 ) ;
                go.runAction(
                    cc.sequence(
                        cc.spawn(
                            cc.rotateBy(3,150),
                            cc.moveTo(3, cc.v2(go.position.x,-1200) ),
                        ),                                
                        cc.callFunc(function(){
                            go.active  = false;
                            go.parent = null;
                            this.fireworks.push(go);
                        }.bind(this))
                    )   
                )
            }.bind(this),j*0.5);
        }
    },

    getFirework(){
        if(this.fireworks.length<=0){
            let go = cc.instantiate(this.firework);
            go.zIndex = 10;
            // go.scale = Math.random() * 1 + 1;
            this.fireworks.push(go);
            let num = parseInt( Math.random()*10 + 1 ) ;
            this.firework.getComponent(cc.Sprite).spriteFrame = this.ui_anim.getSpriteFrame("ribbon"+(num + 1));
        }
        return this.fireworks.pop();
    },
});
