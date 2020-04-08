
/*
* SelectView;
*/
var SelectView = (function (_super) {
    function SelectView(words) {
        SelectView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width / 2, this.height / 2);
        this.words = words;
        this.initSelf(words);

        this.scale(0.7, 0.7);
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2 },150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 75);
        }));
        
    }
    Laya.class(SelectView, "SelectView", _super);

    var __proto = SelectView.prototype;
    __proto.initSelf = function (words) {
        var mask = new Laya.Sprite();
        mask.graphics.drawRect(0, 0, 750, 1334, "#000000");
        mask.alpha = 0.5;
        mask.pivot(375, 667);
        mask.pos(375, 667);
        mask.scale(2, 2);
        this.addChild(mask);

        var bg = new Laya.Sprite();
        bg.loadImage("res/box/bg_select.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var index = 0;
        var height = 90;
        this.mouseThrough = true;
        this.masks = [];
        for (var i = 0; i < 4; ++i) {
            var btn = new Laya.Button("res/box/bg_select_1.png");
            btn.anchorX = 0.5;
            btn.anchorY = 0.5;
            btn.stateNum = 1;
            btn.pos(bg.width/2, 240 + index * height);
            btn.clickHandler = Laya.Handler.create(this, this.btnFunc, [i], false)
            bg.addChild(btn);
            
            var gray = new Laya.Sprite();
            gray.graphics.drawRect(0, 0, btn.width,btn.height, "#000000");
            gray.alpha = 0.2;
            gray.pivot(btn.width/2,btn.height/2);
            gray.pos(btn.x, btn.y);
            bg.addChild(gray);
            gray.visible = false;
            this.masks.push(gray);

            var txt = new Laya.Text();
            txt.color = "#5d4032";
            txt.stroke = 1;
            txt.stroke = "#5d4032";
            txt.text = words ? words[i].word:"abcdefgabcdefg";
            txt.width = 600;
            txt.pivotX = 300;
            txt.fontSize = 40;
            txt.align = "center";
            txt.pos(btn.x, btn.y - 24);
            bg.addChild(txt);
            index++;
        }
    };
    __proto.btnFunc = function(index){
        NetMgr.instance.send('select', {idx:index});

        for(var i = 0; i < 4; ++i){
            this.masks[i].visible = index == i;
        }
    }
    return SelectView;
}(Laya.View));
