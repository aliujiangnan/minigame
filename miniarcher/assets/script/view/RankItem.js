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
        medals:{
            default:[],
            type:[cc.Node],
        },
        avatar:{
            default:null,
            type:cc.Sprite,
        },
        rankLabel:{
            default:null,
            type:cc.Label,
        },
        nameLabel:{
            default:null,
            type:cc.Label,
        },
        scoreLabel:{
            default:null,
            type:cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    init(rank,avatar,name,score){
        this.rankLabel.string = rank <= 3 ? "" : ""+rank;
        for(let i = 0; i < this.medals.length; ++i)
            this.medals[i].active = i == (rank - 1);

        function chkstrlen(str){
            var subStr = "";
            var strlen = 0;
            for(var i = 0;i < str.length; i++){
                if(str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
                strlen += 2;
                else
                strlen++;

                if(strlen <= 10){
                    subStr += str[i];
                }
                else{
                    subStr += "..";
                    break;
                }
            }

            return subStr;
        }
        this.nameLabel.string = chkstrlen(name);            
        this.scoreLabel.string = score.length > 8 ? "99999999" : "" + score;

        // let image = wx.createImage();
        // image.onload = function () {
        //     let texture = new cc.Texture2D();
        //     texture.initWithElement(image);
        //     texture.handleLoadedTexture();
        //     var sprite  = new cc.SpriteFrame(texture);
        //     this.avatar.spriteFrame = sprite;
        //     this.avatar.node.width = 88;
        //     this.avatar.node.height = 88;
        // }.bind(this);
        // image.src = avatar;

        cc.loader.load(avatar, function (err, texture) {
            if(err){

            }
            else{
                var sprite  = new cc.SpriteFrame(texture);
                var sprite  = new cc.SpriteFrame(texture);
                this.avatar.spriteFrame = sprite;
                this.avatar.node.width = 88;
                this.avatar.node.height = 88;
            }
        }.bind(this))
    },
});
