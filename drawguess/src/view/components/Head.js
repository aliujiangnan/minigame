/*
* Head;
*/
var Head = (function (_super) {
    function Head(name,sex,avatar,type) {
        Head.super(this);
        this.scale(Global.scaleX, Global.scaleY);
        this.type = type ? type : 0;
        this.name = name ? name : "ABCabc";
        this.sex = sex ? sex : 1;
        this.avatar = avatar? avatar : "res/head/head_1.png";
        this.initSelf();
    }
    Laya.class(Head, "Head", _super);

    var __proto = Head.prototype;
    __proto.initSelf = function () {
        this.size(96, 96);
        this.pivot(96 / 2, 96 / 2);

        var bg = new Laya.Sprite();
        bg.loadImage("res/draw/bg_head_2.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);
        this.bg = bg;

        var dft = new Laya.Sprite();
        dft.loadImage("res/head/head_1.png");
        dft.pivot(96 / 2, 96 / 2);
        dft.pos(this.width / 2, this.height / 2);
        this.addChild(dft);
        
        var head = new Laya.Sprite();
        head.loadImage(this.avatar, 0,0,96,96);
        head.pivot(96 / 2, 96 / 2);
        head.pos(this.width / 2, this.height / 2);
        this.addChild(head);

        var mask = new Laya.Sprite();
        mask.graphics.drawCircle(0, 0, 96 / 2, "#ffffff");
        mask.pos(96 / 2, 96 / 2);
        head.mask = mask;
        
        var sex = new Laya.Sprite();
        sex.loadImage("res/head/sex_"+this.sex+".png");
        sex.pivot(sex.width / 2, sex.height / 2);
        sex.zOrder = 11;
        this.addChild(sex);
        this.sexSp = sex;

        var draw = new Laya.Sprite();
        draw.loadImage("res/draw/draw.png");
        draw.pivot(draw.width / 2, draw.height / 2)
        draw.pos(this.width / 2, 10);
        this.addChild(draw);
        draw.visible = false;
        this.draw = draw;

        var add = new Laya.Sprite();
        add.loadImage("res/draw/add_0.png");
        add.pivot(add.width / 2, add.height / 2)
        add.pos(this.width / 2, 10);
        this.addChild(add);
        add.visible = false;
        this.addBg = add;

        var scoreBg = new Laya.Sprite();
        scoreBg.loadImage("res/draw/bg_score.png");
        scoreBg.pivot(scoreBg.width / 2, scoreBg.height / 2)
        scoreBg.pos(this.width / 2 + 33, this.height / 2);
        this.addChild(scoreBg);
        this.scoreBg = scoreBg;
        
        var addTxt = new Laya.Text();
        addTxt.font = "fnt_score";
        addTxt.color = "#0";
        addTxt.text = "+0";
        addTxt.width = 50;
        addTxt.align = "center";
        addTxt.pivotX = 25;
        addTxt.pos(add.x + 15,add.y - 15);
        this.addChild(addTxt);
        this.addTxt = addTxt;
        addTxt.visible = false;

        var totalTxt = new Laya.Text();
        totalTxt.font = "fnt_total";
        totalTxt.color = "#0";
        totalTxt.text = "0";
        totalTxt.width = 50;
        totalTxt.align = "center";
        totalTxt.pivotX = 25;
        totalTxt.pos(scoreBg.x + 1,scoreBg.y - 10);
        this.addChild(totalTxt);
        this.totalTxt = totalTxt;

        var nameTxt = new Laya.Text();
        nameTxt.fontSize = 18;
        nameTxt.color = "#ffffff";
        nameTxt.text = this.name;
        nameTxt.width = 200;
        nameTxt.align = "center";
        nameTxt.pivotX = 100;
        this.addChild(nameTxt);
        this.nameTxt = nameTxt;

        if (this.type == 1) {
            dft.scale(.63,.63);
            head.scale(.63,.63);
            sex.pos(head.x - 23, head.y + 23)
            sex.scale(0.7, 0.7);
            nameTxt.pos(this.width / 2, 80);
        }
        else {
            
            nameTxt.color = "#000000";
            nameTxt.stroke = 1;
            nameTxt.strokeColor = "#000000";
            if(this.type == 0){
                sex.pos(head.x + 37, head.y + 37)
                nameTxt.pos(this.width / 2, 110);
            }
            else{
                dft.scale(.63,.63);
                head.scale(.83,.83);
                sex.pos(head.x - 28, head.y + 28)
                if(this.type == 2) {
                    nameTxt.align = "left";
                    nameTxt.pivotX = 0;
                    nameTxt.pos(this.width / 2 + 60, this.height / 2 - 7);
                }
                else{
                    nameTxt.pos(this.width / 2, 90);
                }
            }
            bg.visible = false;
            scoreBg.visible = false;
            totalTxt.visible = false;
        }
    };
    __proto.showAdd = function(num, isPainter){
        this.addBg.graphics.clear();
        if(isPainter){
            this.addBg.loadImage("res/draw/add_1.png");
        }
        else{
            this.addBg.loadImage("res/draw/add_0.png");
        }
        this.addBg.visible = true;
        this.addTxt.text = "+" + num;
        this.addTxt.visible = true;
    };
    __proto.hiddenAdd = function(){
        this.addBg.visible = false;
        this.addTxt.visible = false;
        this.addTxt.text = "";
    }
    
    __proto.showReady = function () {
        var right = new Laya.Sprite();
        right.loadImage("res/ready/right.png");
        right.pivot(right.width / 2, right.height / 2)
        right.pos(this.width / 2, 0);
        right.name = "ready";
        this.addChild(right);
    };

    return Head;
}(Laya.View));