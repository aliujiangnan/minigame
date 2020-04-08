
/*
* ResultView;
*/
var ResultView = (function (_super) {
    function ResultView(results) {
        ResultView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.pivot(this.width/2,this.height / 2);
        this.initSelf(results);

        this.scale(0.7, 0.7);
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2 }, 150, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 75);
        }));
    }
    Laya.class(ResultView, "ResultView", _super);

    var __proto = ResultView.prototype;
    __proto.initSelf = function (results) {
        var mask = new Laya.Sprite();
        mask.graphics.drawRect(0, 0, 750, 1334, "#000000");
        mask.alpha = 0.5;
        mask.pivot(375, 667);
        mask.pos(375, 667);
        mask.scale(2, 2);
        this.addChild(mask);

        var bg = new Laya.Sprite();
        bg.loadImage("res/result/bg.png");
        bg.pivot(bg.width / 2, bg.height / 2);
        bg.pos(this.width / 2, this.height / 2);
        this.addChild(bg);

        var height = 641 / 6 + 0.2;

        for(var i = 0; i < results.length; ++i){
            results[i] = {score:results[i],index:i};
        }

        for(var i = 0; i < results.length; ++i){
            for(var j = i + 1; j < results.length; ++j){
                if(results[j].score > results[i].score){
                    var tmp = results[i];
                    results[i] = results[j];
                    results[j] = tmp;
                }
            }
        }

        for (var i = 0; i < results.length; ++i) {
            var seat = NetMgr.instance.getSeat(results[i].index);
            if(seat == null) continue;
            if(seat.userId == UserMgr.instance.userId){
                var headBg = new Laya.Sprite();
                headBg.loadImage("res/result/bg_head_1.png");
                headBg.pivot(headBg.width / 2, headBg.height / 2);
                headBg.pos(147, 223 + i * height);
                headBg.scale(Global.scaleX,Global.scaleY);
                bg.addChild(headBg);

                var scoreBg = new Laya.Sprite();
                scoreBg.loadImage("res/result/bg_score_"+(i==5?1:0)+".png");
                scoreBg.pivot(scoreBg.width / 2, scoreBg.height / 2);
                scoreBg.pos(bg.width/2 + 2, 223 + i * height );
                bg.addChild(scoreBg);
            }

            if (i < 3) {
                var sp = new Laya.Sprite();
                sp.loadImage("res/result/g_" + i + ".png");
                sp.pivot(sp.width / 2, sp.height / 2);
                sp.pos(70, 216 + i * height);
                bg.addChild(sp);
            }
            else {
                var txt = new Laya.Text();
                txt.color = "#ffffff";
                txt.font = "fnt_rank";
                txt.text = "" + (i + 1);
                txt.width = 50;
                txt.pivotX = 25;
                txt.align = "center";
                txt.pos(70, 211 + i * height);
                bg.addChild(txt);
            }

            var headBg = new Laya.Sprite();
            headBg.loadImage("res/result/bg_head_0.png");
            headBg.pivot(headBg.width / 2, headBg.height / 2);
            headBg.pos(147, 223 + i * height);
            headBg.scale(Global.scaleX,Global.scaleY);
            bg.addChild(headBg);

            var head = new Head(seat.nickName,seat.sex,seat.avatar,2);
            head.pos(147, 223 + i * height);
            bg.addChild(head);

            var txt = new Laya.Text();
            txt.color = "#ffffff";
            txt.font = "fnt_exp";
            txt.text = "+" + results[i].score;
            txt.width = 100;
            txt.pivotX = 50;
            txt.align = "center";
            txt.pos(390, 211 + i * height);
            bg.addChild(txt);
        }
    };
    return ResultView;
}(Laya.View));
