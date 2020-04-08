/**
*StartView
*/
var StartView = (function (_super) {
	function StartView() {
		StartView.__super.call(this);
		this.initSelf();
	}

	Laya.class(StartView, "StartView", _super);

	var __proto = StartView.prototype;
	__proto.initSelf = function () {
		var bg = new Laya.Sprite();
		bg.loadImage("texture/view/bg.png");
		this.addChild(bg);

		var box = new Laya.Box();
		box.size(Global.stageWidth, Global.stageHeight);
		box.pivot(Global.stageWidth / 2, Global.stageHeight / 2);
		box.pos(Global.stageWidth / 2, Global.stageHeight / 2);
		box.scale(Global.scaleX, Global.scaleY);
		this.addChild(box);
		this.container = box;

		var logo = new Laya.Sprite();
		logo.loadImage("texture/view/start/logo.png");
		logo.pivot(logo.width / 2, logo.height / 2);
		logo.pos(750 / 2, 1334 / 4);
		this.container.addChild(logo);

		var startBtn = new Laya.Button("texture/view/start/bt_start.png");
        startBtn.anchorX = 0.5;
        startBtn.anchorY = 0.5;
        startBtn.pos(750 / 2, Laya.stage.height * .6);
        startBtn.stateNum = 1;
        startBtn.name = "btn_start";
        startBtn.on(Laya.Event.MOUSE_DOWN, this, function(){
			startBtn.scale(0.9, 0.9);
		});
		startBtn.on(Laya.Event.MOUSE_UP, this, function(){
			startBtn.scale(1, 1);
			this.onBtnFunc(startBtn);
		}.bind(this))
        this.addChild(startBtn);
    };

    __proto.onBtnFunc = function (sender) {
        switch (sender.name) {
            case "btn_start":
				var view = Laya.stage.addChild(new MatchView());
                break;
        }
    };
	
	return StartView;
})(Laya.View)