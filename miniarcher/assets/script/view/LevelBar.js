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
        boxes:{
            default:[],
            type:[cc.Sprite],
        },
        bosses:{
            default:[],
            type:[cc.Node],
        },
        bgs:{
            default:[],
            type:[cc.Node],
        },
        labeles:{
            default:[],
            type:[cc.Label],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    
    init(){
        for(let i = 0; i < this.boxes.length; ++i){
            this.boxes[i].index = i;
            if(i < 3){
                this.boxes[i].node.active = false;
            }
            else{
                let info = gameInstance.levelesInfo[i - 3][0];
                this.boxes[i].enabled = i == 3;
                this.bosses[i].active = info.hasBoss == "true";
                this.bgs[i].active = true;
                this.labeles[i].string = info.parentNo + "-" + info.selfNo;
            }
        }
    },

    move(){
        let posX = [-255, -175,-95,0,95,175];
        for(let i = 0; i < this.boxes.length; ++i){
            let box = this.boxes[i];
            let index = box.index;
            index--;
            if(index < 0) {
                index = 5;
                box.node.x = 270;
                box.node.active = true;
                let levelIndex = gameInstance.gameView.levelIndex;
                let info = gameInstance.levelesInfo[levelIndex + 2][0];
                this.bosses[i].active = info.hasBoss == "true";
                this.bgs[i].active = true;
                this.labeles[i].string = info.parentNo + "-" + info.selfNo;
                box.node.runAction(cc.moveTo(.3,cc.v2(175, 0))).easing(cc.easeQuinticActionOut());
            }
            else{
                box.enabled = index == 3;
                box.node.runAction(cc.spawn(
                    cc.moveTo(.3,cc.v2(posX[index],0)).easing(cc.easeQuinticActionOut()),
                    cc.scaleTo(.2,index == 3 ? 1 : .75),
                ))
            }
            box.index = index;
        }
    },
    
    reset(){
        let posX = [-255, -175,-95,0,95,175];
        for(let i = 0; i < this.boxes.length; ++i){
            this.boxes[i].node.x = posX[i];
            this.boxes[i].node.scale = i == 2 ? 1 : .75;
        }
    }
});
