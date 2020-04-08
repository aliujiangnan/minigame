/**
*LoadView
*/
var LoadView = (function (_super) {
    function LoadView() {
        LoadView.__super.call(this);
        this.initSelf();
    }

    Laya.class(LoadView, "LoadView", _super);

    var __proto = LoadView.prototype;
    __proto.initSelf = function () {
        var bg = new Laya.Sprite();
        bg.loadImage("load.png");
        bg.name = "load";
        Laya.stage.addChild(bg);
        this.loadRes();
    };

    __proto.loadRes = function () {
        var resArr =
            [
                "res/head/bg_head.png",
                "res/head/bg_head_0.png",
                "res/head/color_0.png",
                "res/head/color_1.png",
                "res/head/head_0.png",
                "res/head/head_1.png",
                "res/head/sex_0.png",
                "res/head/sex_1.png",
                "res/head/light_0.png",
                "res/head/light_1.png",
                "res/head/mid.png",
                "res/head/progress_0$bar.png",
                "res/head/progress_0.png",
                "res/head/progress_1$bar.png",
                "res/head/progress_1.png",
                "res/ready/bg.png",
                "res/ready/box_1.png",
                "res/ready/box_2.png",
                "res/ready/box_3.png",
                "res/ready/btn_1.png",
                "res/ready/btn_2.png",
                "res/ready/btn_3.png",
                "res/ready/btn_4.png",
                "res/ready/btn_5.png",
                "res/ready/btn_6.png",
                "res/ready/btn_7.png",
                "res/ready/head_1.png",
                "res/ready/bg_head.png",
                "res/ready/jiazi.png",
                "res/ready/right.png",
                "res/ready/line_0.png",
                "res/ready/tx_1.png",
                "res/ready/tx_2.png",
                "res/ready/tx_3.png",
                "res/ready/tx_4.png",
                "res/ready/tx_5.png",
                "res/ready/tx_6.png",
                "res/ready/bg_head.png",
                "res/ready/bg_title.png",
                "res/ready/btn_voice.png",
                "res/ready/btn_emoji.png",
                "res/ready/btn_send.png",
                "res/ready/clock.png",
                "res/ready/hand.png",
                "res/ready/panel.png",
                "res/ready/speak.png",
                "res/box/line.png",
                "res/draw/bg.png",
                "res/draw/bg_1.png",
                "res/draw/bg_2.png",
                "res/draw/btn_color_1.png",
                "res/draw/btn_color_2.png",
                "res/draw/btn_pen_1.png",
                "res/draw/btn_pen_2.png",
                "res/draw/btn_eraser_1.png",
                "res/draw/btn_eraser_2.png",
                "res/draw/btn_1.png",
                "res/draw/btn_2.png",
                "res/draw/btn_3.png",
                "res/draw/add_0.png",
                "res/draw/add_1.png",
                "res/draw/bg_head.png",
                "res/draw/bg_head_1.png",
                "res/draw/bg_head_2.png",
                "res/draw/bg_score.png",
                "res/draw/line.png",
                "res/draw/draw.png",
                "res/draw/sp_1.png",
                "res/draw/sp_2.png",
                "res/draw/sp_3.png",
                "res/draw/sp_4.png",
                "res/draw/sp_5.png",
                "res/draw/sp_6.png",
                "res/draw/sp_7.png",
                "res/draw/sp_8.png",
                "res/draw/sp_9.png",
                "res/draw/sp_10.png",
                "res/result/bg.png",
                "res/result/bg_head_0.png",
                "res/result/bg_head_1.png",
                "res/result/g_0.png",
                "res/result/g_1.png",
                "res/result/g_2.png",
                "res/result/bg_score_0.png",
                "res/result/bg_score_1.png",
                "res/box/bg_kick_0.png",
                "res/box/bg_kick_1.png",
                "res/box/bg_answer.png",
                "res/box/bg_color.png",
                "res/box/bg_eraser.png",
                "res/box/bg_head.png",
                "res/box/bg_online.png",
                "res/box/bg_pen.png",
                "res/box/bg_pen_1.png",
                "res/box/bg_report.png",
                "res/box/bg_select.png",
                "res/box/bg_select_1.png",
                "res/box/bg_selecting.png",
                "res/box/bg_skip.png",
                "res/box/btn_cancel.png",
                "res/box/btn_no.png",
                "res/box/btn_ok.png",
                "res/box/btn_report.png",
                "res/box/btn_save.png",
                "res/box/btn_yap.png",
                "res/box/color_1.png",
                "res/box/color_2.png",
                "res/box/color_3.png",
                "res/box/color_4.png",
                "res/box/color_5.png",
                "res/box/color_6.png",
                "res/box/color_7.png",
                "res/box/color_8.png",
                "res/box/color_9.png",
                "res/box/color_10.png",
                "res/box/eraser_1.png",
                "res/box/eraser_2.png",
                "res/box/eraser_3.png",
                "res/box/eraser_4.png",
                "res/box/eraser_5.png",
                "res/box/pen_1.png",
                "res/box/pen_2.png",
                "res/box/pen_3.png",
                "res/box/pen_4.png",
                "res/box/pen_5.png",
                "res/box/selecting.png",
                "res/box/bg_head_1.png",
                "res/box/bg_observer.png",
                "res/box/bg_rule.png",
                "res/box/rule.png",
            ];

        Laya.loader.load(resArr, Laya.Handler.create(this, this.loadFont));
    };
    __proto.loadFont = function () {

        var fntArr = [
            "res/ready/tnz-laya.fnt",
            "res/ready/tobs-laya.fnt",
            "res/draw/txthjf-laya.fnt",
            "res/draw/txthzf-laya.fnt",
            "res/result/tjy-laya.fnt",
            "res/result/tpm-laya.fnt",
        ];
        var nameArr = [
            "fnt_time",
            "fnt_obs",
            "fnt_score",
            "fnt_total",
            "fnt_exp",
            "fnt_rank",
        ];

        var num = fntArr.length;
        for (var i = 0; i < num; i++) {
            var name = nameArr[i];
            var font = new Laya.BitmapFont();
            font.loadFont(fntArr[i], new Laya.Handler(this, function (font, name, count, num) {
                font.setSpaceWidth(10);
                Laya.Text.registerBitmapFont(name, font);
                if (count >= num - 1) {
                    this.initGame();
                }
            }, [font, name, i, num]));
        }
    };
    __proto.initGame = function () {
        new UserMgr();
        new NetMgr();
        Global.gameInstance = Laya.stage.addChild(new RoomView());
        this.removeSelf();
        this.destroy();
    };

    return LoadView;
})(Laya.View)