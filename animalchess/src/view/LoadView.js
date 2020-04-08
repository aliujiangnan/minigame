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
            { url: "res/atlas/texture/anim/eatAni.atlas", type: "atlas" },
            { url: "res/atlas/texture/anim/openAni.atlas", type: "atlas" },
            { url: "res/atlas/texture/view/end.atlas", type: "atlas" },
            { url: "res/atlas/texture/view/match.atlas", type: "atlas" },
            { url: "res/atlas/texture/view/start.atlas", type: "atlas" },
            { url: "res/atlas/texture/emoji.atlas", type: "atlas" },
            { url: "res/atlas/texture/game.atlas", type: "atlas" },
            { url: "res/atlas/texture/medal.atlas", type: "atlas" },
            { url: "res/atlas/texture/game/font.atlas", type: "atlas" },
            { url: "sound/animal_0.wav", type: "sound" },
            { url: "sound/animal_1.wav", type: "sound" },
            { url: "sound/animal_2.wav", type: "sound" },
            { url: "sound/animal_3.wav", type: "sound" },
            { url: "sound/animal_4.wav", type: "sound" },
            { url: "sound/animal_5.wav", type: "sound" },
            { url: "sound/animal_6.wav", type: "sound" },
            { url: "sound/animal_7.wav", type: "sound" },
            { url: "sound/eat.wav", type: "sound" },
            { url: "sound/flip.wav", type: "sound" },
            { url: "sound/time.mp3", type: "sound" },
            { url: "sound/click.mp3", type: "sound" },
            // { url: "sound/move.wav", type: "sound" },
            { url: "sound/move.mp3", type: "sound" },
            { url: "sound/bg.mp3", type: "sound" },
            { url: "texture/emoji/box.png", type: "image" },
            { url: "texture/game/bg.png", type: "image" },
            { url: "texture/game/bg_msgBox_1.png", type: "image" },
            { url: "texture/game/bg_msgBox_2.png", type: "image" },
            { url: "texture/game/bg_ready.png", type: "image" },
            { url: "texture/game/lu.png", type: "image" },
            { url: "texture/game/order.png", type: "image" },
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
        Laya.loader.load(resNames, Laya.Handler.create(this, this.loadFont));
    };
    __proto.loadFont = function () {
        var fontNames = new Array(
            "start_ts_laya",
            "match_txt_count-laya",
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