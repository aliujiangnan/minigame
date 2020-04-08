/*
* ChatCnt;
*/
var ChatCnt = (function (_super) {
    var wid = 700, hei = 40;
    function ChatCnt(w, h) {
        ChatCnt.super(this);
        this.size(w,h);
        this.pivot(w/2,h/2);
        wid = w;
        hei = h > 300 ? h / 7 : h / 4;
        this.initSelf();
    }
    Laya.class(ChatCnt, "ChatCnt", _super);
    
    function Item() {
        Item.__super.call(this);
        this.size(wid, hei);
        
        var txt = new Laya.Text();
        txt.fontSize = 24;
        txt.color = "#000000";
        txt.width = 700;
        txt.pos(10,hei/2 - 20);
        this.addChild(txt);
        this.txt = txt;
        txt.wordWrap
        this.hasSet = false;
        this.setTxt = function (isSystem,isHit,callback,str) {
            this.txt.text = str;
            if(isSystem){
                this.txt.color = "#ff0000";
                this.txt.fontSize = 24;
            }
            if(isHit)this.txt.color = "#00ff00";
            this.hasSet = true;
            if(callback)this.on(Laya.Event.CLICK,this,callback)
        }
    }
    
    Laya.class(Item, "ChatItem", Laya.Box);
    
    var __proto = ChatCnt.prototype;
    __proto.initSelf = function () {
        var sp = new Laya.Sprite();
        sp.pivot(this.width / 2,this.height / 2);
        sp.pos(this.width / 2,this.height / 2);
        this.addChild(sp);
        this.box = sp;

        this.initList();
    };
     __proto.initList = function(){
        
        function updateItem(cell, index) {
            if(cell.hasSet) return;
            cell.setTxt(cell.dataSource.isSystem, cell.dataSource.isHit, cell.dataSource.callback,cell.dataSource.str);
        }

        function onSelect(index) {
            console.log("当前选择的索引：" + index);
        }

        function onMouse(event) {

        }
        
        var list = new Laya.List();
        list.itemRender = Item;
        list.repeatX = 1;
        list.repeatY = 10000;
        list.size(this.width,this.height);
        list.pivot(list.width/2,list.height/2);
        list.pos(this.width/2,this.height/2 +hei* (this.height > 300 ? 7 : 4));
        // 使用但隐藏滚动条
        list.vScrollBarSkin = "";
        list.selectEnable = true;
        list.renderHandler = new Laya.Handler(this, updateItem);
        this.box.addChild(list);
        this.list = list;
        // 设置数据项为对应图片的路径
        var data = [];
        list.array = data;
        
        var txt = new Laya.Text();
        txt.color = "#ffffff";
        txt.text = "";
        txt.width = wid;
        txt.pivotX = txt.width/2;
        txt.wordWrap = true;
        txt.align = "center";
        txt.fontSize = 24;
        this.lineTxt = txt;
    };
    __proto.addMsg = function(str,isHit,callback){
        var isSystem = str.substr(0,6)=="System";
        this.lineTxt.text = str;
        var lines = this.lineTxt.lines;
        for(var i = 0; i < lines.length; ++i){
            this.addStr(isSystem, isHit,callback, lines[i]);
        }
    };
    __proto.addStr = function(isSystem,isHit,callback,str){
        this.list.addItem({isSystem:isSystem,isHit:isHit,callback:callback,str:str});
        if(this.list.array.length < (this.height > 300 ?8:5))
            this.list.y -= hei;
        
        this.list.scrollTo(this.list.array.length-1);
    }
    return ChatCnt;
}(Laya.View));