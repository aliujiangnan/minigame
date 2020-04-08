"use strict";
cc._RF.push(module, '0819dZJLoVLFr1E+PXiSIKj', 'RankContent');
// script/view/RankContent.js

"use strict";

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
        itemPre: {
            default: null,
            type: require("RankItem")
        },
        itemNos: {
            default: [],
            visible: false
        },
        items: {
            default: [],
            visible: false
        },
        loading: {
            type: cc.Node,
            default: null
        },
        //是否查询数据
        isShowData: {
            default: false,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    update: function update() {
        // this.isShowRLData();
    },

    isShowRLData: function isShowRLData() {
        var _this2 = this;

        var _this = this;
        wx.onMessage(function (data) {
            if (data.msg == "display") {
                //更新状态
                if (_this.isShowData) return;
                _this.isShowData = true;
                //显示排行榜数据
                _this2.getUserListData();
            }
        });
    },

    getUserListData: function getUserListData() {
        var self = this;
        wx.getFriendCloudStorage({
            keyList: ["score"],
            success: function success(res) {
                console.log("self => ", self, "res.data => ", res.data);
                self.init(res.data);
            }
        });
    },
    start: function start() {
        this.loading.runAction(cc.repeatForever(cc.rotateBy(1, 180)));
    },
    init: function init(dataList) {
        this.loading.active = false;
        // var dataList = [
        //     {
        //         avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ggopXgXL20fxbj2jcSROnj5gmyj3ia4U11K4HFIcf8zBhhAYjqMdAOibFTapSYZfbtSf6DicssUZArserHXPIoPWQ/132?aaa=aa.jpg",
        //         nickname:"玩家1",
        //         openid:"123",
        //         KVDataList:[{key:"score",value:"1"},{key:"score",value:"2"}],
        //     },
        //     {
        //         avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ggopXgXL20fxbj2jcSROnj5gmyj3ia4U11K4HFIcf8zBhhAYjqMdAOibFTapSYZfbtSf6DicssUZArserHXPIoPWQ/132?aaa=aa.jpg",
        //         nickname:"玩家2",
        //         openid:"123",
        //         KVDataList:[{key:"score",value:"2"},{key:"score",value:"3"}],
        //     },
        //     {
        //         avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/ggopXgXL20fxbj2jcSROnj5gmyj3ia4U11K4HFIcf8zBhhAYjqMdAOibFTapSYZfbtSf6DicssUZArserHXPIoPWQ/132?aaa=aa.jpg",
        //         nickname:"玩家3",
        //         openid:"123",
        //         KVDataList:[{key:"score",value:"3"},{key:"score",value:"4"}],
        //     }
        // ];

        // function getHighScore(kvlist){
        //     let score = 0;
        //     for(let i = 0; i < kvlist.length; ++i){
        //         let value = parseInt(kvlist[i].value);
        //         if(score < value)
        //             score = value;                
        //     }

        //     return score;
        // }

        // for(let i = 0; i < dataList.length; ++i){
        //     dataList[i].highScore = getHighScore(dataList[i].KVDataList);
        // }

        // for(let i = 0; i < dataList.length; ++i){
        //     for(let j = i; j < dataList.length; ++j){
        //         if(dataList[i].highScore < dataList[j].highScore){
        //             let data = {
        //                 avatarUrl:dataList[j].avatarUrl,
        //                 nickname:dataList[j].nickname,
        //                 openid:dataList[j].openid,
        //                 KVDataList:dataList[j].KVDataList,
        //                 highScore:dataList[j].highScore,
        //             };
        //             dataList[j] = dataList[i];
        //             dataList[i] = data;
        //         }
        //     }
        // }
        // for(let i = dataList.length - 1; i >= 0; --i){
        //     let data = dataList[i];
        //     let no = this.getItem();
        //     no.active = true;
        //     let item = no.getComponent("RankItem");
        //     item.init(i+1,data.avatarUrl,data.nickname,""+data.highScore);
        //     no.parent = this.itemPre.node.parent;
        //     this.items.push(item);
        // }

        for (var i = dataList.length - 1; i >= 0; --i) {
            var data = dataList[i];
            var no = this.getItem();
            no.active = true;
            var item = no.getComponent("RankItem");
            item.init(i + 1, data.avatar, data.nickname, "" + data['score:normal']);
            no.parent = this.itemPre.node.parent;
            this.items.push(item);
        }
    },
    getItem: function getItem() {
        if (this.itemNos.length <= 0) {
            var go = cc.instantiate(this.itemPre.node);
            this.itemNos.push(go);
        }
        return this.itemNos.pop();
    },
    onClose: function onClose() {
        for (var i = 0; i < this.items.length; ++i) {
            this.items[i].node.parent = null;
        }this.items = [];
    }
});

cc._RF.pop();