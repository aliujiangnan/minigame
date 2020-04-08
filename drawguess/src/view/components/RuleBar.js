//TODO:
/*
* RuleBar;
*/
var RuleBar = (function (_super) {
    function RuleBar() {
        RuleBar.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width / 2, this.height / 2);
        this.initSelf();
    }
    Laya.class(RuleBar, "RuleBar", _super);
    var wid = 694, hei = 3129;
    function Item() {
        Item.__super.call(this);
        this.size(wid, hei);
        this.img = new Laya.Sprite();
        this.img.pos(wid/2,hei/2 - 0);
        this.addChild(this.img);

        this.setImg = function (src) {
            this.hasSet = true;
            this.img.loadImage(src);
            this.img.pivot(this.img.width/2,this.img.height/2);
        }
    }
    Laya.class(Item, "RuleItem", Laya.Box);

    var __proto = RuleBar.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_rule.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);
        this.bg = bg;
        this.mouseThrough = true;
        this.initList();
    };

    __proto.showSelf = function(){
        this.visible = true;
        this.scale(0.7, 0.7);
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 75);
        }));
    };

     __proto.initList = function(){
        function updateItem(cell, index) {
            if(cell.hasSet) return;
            cell.setImg(cell.dataSource);
            cell.name = index + "";
        }
        var list = new Laya.List();
        list.itemRender = Item;
        list.repeatX = 1;
        list.repeatY = 5;
        list.size(700,950);
        list.pivot(list.width/2,list.height/2);
        list.pos(375, 667 + 50);
        // 使用但隐藏滚动条
        list.vScrollBarSkin = "";
        list.selectEnable = true;
        this.addChild(list);
        list.renderHandler = new Laya.Handler(this, updateItem);
        list.array = ["res/box/rule.png"];
    }

    return RuleBar;
}(Laya.View));