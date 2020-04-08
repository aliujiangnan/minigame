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
        var resNames = new Array(
            { url: "res/atlas/texture/view/end.atlas", type: "atlas" },
            { url: "res/atlas/texture/view/match.atlas", type: "atlas" },
            { url: "res/atlas/texture/view/start.atlas", type: "atlas" },
            { url: "res/atlas/texture/game.atlas", type: "atlas" },
            { url: "res/atlas/texture/medal.atlas", type: "atlas" },
            { url: "sound/clear.mp3", type: "sound" },
            { url: "sound/failed.mp3", type: "sound" },
            { url: "texture/game/sex_0.png", type: "image" },
            { url: "texture/game/sex_1.png", type: "image" },
            { url: "texture/game/bg_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_2.png", type: "image" },
            { url: "texture/game/bg_ready.png", type: "image" },
            { url: "texture/game/ready.png", type: "image" },
            { url: "texture/game/go.png", type: "image" },
            { url: "texture/game/find.png", type: "image" },
            { url: "texture/game/round.png", type: "image" },
            { url: "texture/game/loading.png", type: "image" },
            { url: "texture/game/guang.png", type: "image" },
            { url: "texture/game/line_0.png", type: "image" },
            { url: "texture/game/line_1.png", type: "image" },
            { url: "texture/game/opponent.png", type: "image" },
            { url: "texture/view/end/di2.png", type: "image" },
            { url: "texture/view/end/lifeBox.png", type: "image" },
            { url: "texture/view/end/title_defatul_box.png", type: "image" },
            { url: "texture/view/end/title_draw_box.png", type: "image" },
            { url: "texture/view/end/title_victory_box.png", type: "image" },
            { url: "texture/view/end/victoryguang.png", type: "image" },
            { url: "texture/view/match/bg_black.png", type: "image" },
            { url: "texture/view/match/box.png", type: "image" },
            { url: "texture/view/match/bule.png", type: "image" },
            { url: "texture/view/match/red.png", type: "image" },
            { url: "texture/view/start/logo.png", type: "image" },
        );
        Laya.loader.load(resNames, Laya.Handler.create(this, this.loadAnim));
    };

    __proto.loadAnim = function () {
        var getUrlArray = function (name, length, i) {
            var array = [];
            for (var i = 0; i < length; i++) {
                array.push(name + "_" + i + ".png");
            }
            return array;
        };

        for (var i = 2; i < 3; ++i)
            Laya.Animation.createFrames(getUrlArray("texture/game/explode_" + i, 3, 0), "explode_" + i);

        this.loadFont();
    };

    __proto.loadFont = function () {
        var fontNames = new Array(
            "start_ts_laya",
            "match_txt_count-laya",
            "shop_txt_title-laya",
            "end_txt_head-laya",
            "end_txt_hs-laya",
            "end_txt_score-laya",
            "end_txt_s_add-laya",
            "end_txt_s_sub-laya",
            "newend-bf-laya",
            "newend-zf-laya",
            "end_txt_l-laya",
            "end_txt_lv-laya",
            "num-laya"
        );

        var num = fontNames.length;
        for (var i = 0; i < num; i++) {
            var name = fontNames[i];
            var font = new Laya.BitmapFont();
            font.loadFont((i == num - 1 ? "texture/game/" : "font/") + name + ".fnt", new Laya.Handler(this, function (font, name, count, num) {
                if (i == num - 1) font.setSpaceWidth(10);
                Laya.Text.registerBitmapFont(name, font);
                if (count >= num - 1) {
                    this.initGame();
                }
            }, [font, name, i, num]));
        }
    };

    __proto.initGame = function () {
        new UserMgr();
        if (Global.testType == 0) Global.robotType = 1;
        new NetMgr();
        Laya.stage.addChild(new StartView());
        this.removeSelf();
        this.destroy();
    };

    return LoadView;
})(Laya.View)