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
            { url: "res/atlas/texture/medal.atlas", type: "atlas" },
            { url: "sound/bgm.mp3", type: "sound" },
            { url: "sound/bullet.mp3", type: "sound" },
            { url: "sound/explode.mp3", type: "sound" },
            { url: "sound/laser.wav", type: "sound" },
            { url: "texture/emoji/box.png", type: "image" },
            { url: "texture/game/bg.png", type: "image" },
            { url: "texture/game/bg_head.png", type: "image" },
            { url: "texture/game/bg_msgBox_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_2.png", type: "image" },
            { url: "texture/game/bg_ready.png", type: "image" },
            { url: "texture/game/blood.png", type: "image" },
            { url: "texture/game/line.png", type: "image" },
            { url: "texture/game/bullet_0_1_0.png", type: "image" },
            { url: "texture/game/bullet_0_1_1.png", type: "image" },
            { url: "texture/game/bullet_0_1_2.png", type: "image" },
            { url: "texture/game/bullet_0_1_3.png", type: "image" },
            { url: "texture/game/bullet_1_1_0.png", type: "image" },
            { url: "texture/game/bullet_1_1_1.png", type: "image" },
            { url: "texture/game/bullet_1_1_2.png", type: "image" },
            { url: "texture/game/bullet_1_1_3.png", type: "image" },
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

        for (var i = 0; i < 2; ++i) {
            Laya.Animation.createFrames(getUrlArray("texture/game/bullet_" + i + "_1", 4, 0), "bullet_" + i + "_1");
        }
        Laya.Animation.createFrames(getUrlArray("texture/game/fire_1", 2, 0), "fire_1");
        Laya.Animation.createFrames(getUrlArray("texture/game/fire_2", 2, 0), "fire_2");
        Laya.Animation.createFrames(getUrlArray("texture/game/fire_3", 2, 0), "fire_3");
        Laya.Animation.createFrames(getUrlArray("texture/game/fire", 2, 0), "fire");
        Laya.Animation.createFrames(getUrlArray("texture/game/hit", 5, 0), "hit");
        Laya.Animation.createFrames(getUrlArray("texture/game/explode", 11, 0), "explode");

        this.loadFont();
    }

    __proto.loadFont = function () {
        var fontNames = new Array(
            "start_txtCus-laya",
            "start_txt_score-laya",
            "match_txt_count-laya",
            "shop_txt_title-laya",
            "end_txt_head-laya",
            "end_txt_hs-laya",
            "end_txt_score-laya",
            "end_txt_s_add-laya",
            "end_txt_s_sub-laya",
            "end_txt_l-laya",
            "newend-bf-laya",
            "newend-zf-laya",
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