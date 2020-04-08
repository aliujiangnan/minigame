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
            { url: "res/atlas/texture/emoji.atlas", type: "atlas" },
            { url: "res/atlas/texture/game.atlas", type: "atlas" },
            { url: "res/atlas/texture/game/player.atlas", type: "atlas" },
            { url: "res/atlas/texture/medal.atlas", type: "atlas" },
            { url: "sound/hit.wav", type: "sound" },
            { url: "sound/jump.wav", type: "sound" },
            { url: "texture/emoji/box.png", type: "image" },
            { url: "texture/game/sex_0.png", type: "image" },
            { url: "texture/game/sex_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_2.png", type: "image" },
            { url: "texture/game/bg_ready.png", type: "image" },
            { url: "texture/game/bg.png", type: "image" },
            { url: "texture/game/cloud.png", type: "image" },
            { url: "texture/game/progress.png", type: "image" },
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
        var getUrlArray = function (start, length, type) {
            var array = [];
            var path = "texture/game/player/p" + (type + 1);

            for (var i = start; i < start + length; i++) {
                array.push(path + "_" + i + ".png");
            }
            return array;
        };

        for (var i = 0; i < 2; i++) {
            Laya.Animation.createFrames(getUrlArray(1, 2, i), "idle_" + i);
            Laya.Animation.createFrames(getUrlArray(3, 2, i), "jump_" + i);
            Laya.Animation.createFrames(getUrlArray(5, 2, i), "dizzy_" + i);
        }

        this.loadFont();
    }

    __proto.loadFont = function () {
        var fontNames = new Array(
            "start_txt_cu",
            "start_txt_se",
            "match_txt_count-laya",
            "shop_txt_t",
            "shop_txt_s",
            "end_txt_head-laya",
            "end_txt_hs-laya",
            "end_txt_score-laya",
            "end_txt_s_add-laya",
            "end_txt_s_sub-laya",
            "newend-bf-laya",
            "newend-zf-laya",
            "end_txt_l-laya",
            "end_txt_lv-laya"
        );

        var num = fontNames.length;
        for (var i = 0; i < num; i++) {
            var name = fontNames[i];
            var font = new Laya.BitmapFont();
            font.loadFont("font/" + name + ".fnt", new Laya.Handler(this, function (font, name, count, num) {
                Laya.Text.registerBitmapFont(name, font);
                if (count >= num - 1) {
                    this.initGame();
                }
            }, [font, name, i, num]));
        }

        Laya.loader.load("particle/star.part", Laya.Handler.create(this, function (setting) {
            Global.setting = setting;
        }), null, Laya.Loader.JSON);
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