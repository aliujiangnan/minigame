"use strict";
cc._RF.push(module, '0c6c3ppto9PPL3ERga8jlq0', 'SDKHelper');
// script/game/SDKHelper.js

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
var HttpApi = require("HttpApi");
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
        adCallback: {
            default: null,
            visible: false
        },
        gameId: {
            default: "mini-archer",
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {},


    // update (dt) {},

    login: function login() {
        var username = localStorage.getItem("game_username");
        if (username == "" || username == null) localStorage.setItem("game_username", Date.now().toString());
        username = localStorage.getItem("game_username");

        var data = {
            "gameid": this.gameId,
            "userid": username,
            "username": username,
            "nickname": username,
            "gender": 1,
            "avatar": "http://sandbox-avatar.boochat.cn/2018/01/20/02/3/0042758573.gif"
        };

        HttpApi.create("post", "/login", data).send(function (res) {
            if (res.Error) {} else {
                this.getProfile();
            }
        }.bind(this));
    },
    getProfile: function getProfile() {
        HttpApi.create("get", "/profile").send(function (res) {
            if (res.Error) {} else {
                var data = JSON.parse(res.data).data;
                if (data.playerinfo) {
                    data = JSON.parse(data.playerinfo);
                    playerInfo.gold = data.gold;
                    playerInfo.skinList = data.skinlist;
                    playerInfo.shopList = data.shoplist;
                    playerInfo.useSkin = data.useskin;
                    playerInfo.lastLevelIndex = data.lastlevelindex;
                }
            }
        }.bind(this));
    },
    uploadPlayerInfo: function uploadPlayerInfo() {
        var playerinfo = {
            gold: playerInfo.gold,
            skinlist: playerInfo.skinList,
            shoplist: playerInfo.shopList,
            useskin: playerInfo.useSkin,
            lastlevelindex: playerInfo.lastLevelIndex
        };
        HttpApi.create("post", "/userinfo/game", { playerinfo: JSON.stringify(playerinfo) }).send(function (res) {
            if (res.Error) {} else {}
        }.bind(this));
    },
    uploadScore: function uploadScore(score) {
        if (gameInstance.isWeChat) {
            wx.setUserCloudStorage({
                KVDataList: [{ key: "score", value: score }],
                success: function success(res) {
                    console.log(res);
                },
                complete: function complete(res) {
                    console.log(res);
                }
            });
        } else {
            HttpApi.create("post", "/score/report", { "score": playerInfo.highScore.toString(), "tag": "normal" }).send(function (res) {
                if (res.Error) {} else {}
            });
        }
    },
    showRank: function showRank(callback) {
        if (gameInstance.isWeChat) {
            //向开放域发送请求
            wx.getOpenDataContext().postMessage({
                msg: "display"
            });
        } else {
            var getUserinfos = function getUserinfos(ids) {
                HttpApi.create("get", "/getuserinfos", "userids=" + ids).send(function (res) {
                    if (res.Error) {} else {
                        callback(JSON.parse(res.data).data);
                    }
                }.bind(this));
            };

            HttpApi.create("get", "/ranks/global", "tag=score:normal").send(function (res) {
                if (res.Error) {} else {
                    var ids = "";
                    var data = JSON.parse(res.data).data;
                    for (var i = 0; i < data.length; ++i) {
                        ids += data[i].userid + (i == data.length - 1 ? "" : ",");
                    }

                    getUserinfos(ids);
                }
            }.bind(this));
        }
    },


    //分享方法（主动转发）
    //参数：标题，图片路径，查询字符串，审核过的图片ID
    share: function share(title, imageUrl, query, imageUrlId) {
        title = title ? title : "有一种梦想叫『称霸朋友圈』，别迷恋哥，哥只是个传说。";
        imageUrl = imageUrl ? imageUrl : "https://miniarcher-1256660609.cos.ap-chengdu.myqcloud.com/share/archery.png";
        if (gameInstance.isWeChat) {
            wx.shareAppMessage({
                title: title,
                imageUrl: imageUrl || canvas.toTempFilePathSync({
                    destWith: 500,
                    destHeight: 400
                }),
                query: query,
                imageUrlId: imageUrlId,
                //判断是否分享成功
                success: function success() {
                    console.log("分享成功");
                },
                complete: function complete() {
                    console.log("分享失败");
                }
            });
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(I)V", type);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {} else {}
    },
    showAd: function showAd(type, callback) {
        this.adCallback = callback;

        if (gameInstance.isWeChat) {} else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(I)V", type);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {} else {
            this.onAdCallback("played");
        }
    },
    onAdCallback: function onAdCallback(status) {
        console.log("onAdCallback, status: " + status);
        if (this.adCallback != null) this.adCallback(status);
        this.adCallback = null;
    }
});

cc._RF.pop();