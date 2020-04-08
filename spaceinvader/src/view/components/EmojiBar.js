//TODO:
/*
* EmojiBar;
*/
var EmojiBar = (function (_super) {
    function EmojiBar(type) {
        EmojiBar.super(this);
        this.scale(Global.scaleY, Global.scaleX);
        this.size(100,100);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.initSelf();
    }
    Laya.class(EmojiBar, "EmojiBar", _super);
    var wid = 106, hei = 70, index = 1;
    function Item() {
        Item.__super.call(this);
        this.size(wid, hei);
        this.img = new Laya.Sprite();
        this.img.pos(wid/2,hei/2 - 0);
        this.addChild(this.img);

        this.setImg = function (src) {
            this.hasSet = true;
            var img = Laya.loader.getRes(src);
            if(img==null)return;
            this.img.graphics.drawTexture(img);
            this.img.pivot(img.width/2,img.height/2);
        }
        ++index;
    }

    Laya.class(Item, "Item", Laya.Box);

    var __proto = EmojiBar.prototype;
    __proto.initSelf = function () {        
        var btn = new Laya.Sprite();
        btn.loadImage("texture/emoji/btn.png");
        btn.pivot(btn.width / 2, btn.height / 2);
        btn.pos(this.width * 0.9, this.height / 2);
        this.addChild(btn);

        var btn1 = new Laya.Button("texture/emoji/bg_btn_0.png");
        btn1.anchorX = 0.5;
        btn1.anchorY = 0.5;
        btn1.stateNum = 3;
        btn1.pos(btn.x, btn.y);
        btn1.clickHandler = new Laya.Handler(this, this.btnFunc);
        this.btn = btn1;
        this.addChild(btn1);

        var box = new Laya.Sprite();
        box.loadImage("texture/emoji/box.png");
        box.pivot(box.width, box.height / 2);
        box.pos(btn.x - 60, btn.y);
        this.addChild(box);
        this.box = box;

        this.initList();

        this.box.scaleX = 0;
        this.isBoxOut = false;
        this.isMoveBox = false;
    };
     
    __proto.initList = function(){
        function updateItem(cell, index) {
            if(cell.hasSet) return;
            cell.setImg(cell.dataSource);
            cell.name = index + "";
        }

        function sendEmoji(index){
            var data = {'idx':index}
            EventHelper.instance.event("player_emoji",[{'idx':index}, 0])
            if(Global.testType!=0)NetMgr.instance.send("emoji", data);
        };

        function onSelect(index) {
            if(index==6) return;
            sendEmoji(index+1)
        }

        function onMouse(event) {
            if(event.type == "mouseup")
            sendEmoji(parseInt(event.target.name)+1)
        }
        
        var list = new Laya.List();
        list.itemRender = Item;
        list.repeatX = 6;
        list.repeatY = 1;
        list.size(108*5 + 00,hei*1);
        list.pivot(list.width/2,list.height/2);
        list.pos(375 - 98,133/2 - 20);
        // 使用但隐藏滚动条
        list.hScrollBarSkin = "";
        list.selectEnable = true;
        list.mouseHandler = new Laya.Handler(this, onMouse);
        list.renderHandler = new Laya.Handler(this, updateItem);
        this.box.addChild(list);
        // 设置数据项为对应图片的路径
        var data = [];
        for (var i = 0; i < 5; ++i) {
            data.push("texture/emoji/"+(i+1)+".png");
        }
        list.array = data;
    }

    __proto.btnFunc = function () {
        var self = this;
        if (self.isMoveBox) return;
            self.isMoveBox = true;
        Laya.Tween.to(self.box, { scaleX: self.isBoxOut ? 0 : 1 }, 100, self.isBoxOut ? Laya.Ease.quintIn : Laya.Ease.quintOut, Laya.Handler.create(self, function () {
            self.isMoveBox = false;
            self.isBoxOut = !self.isBoxOut;
        }))
    };

    return EmojiBar;
}(Laya.View));