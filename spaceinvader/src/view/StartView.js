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
		var view = new GameView();
		this.gameView = view;
		this.addChild(view);

		var startBtn = new Laya.Button("texture/view/start/btn_bullet.png");
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

		EventHelper.instance.once("do_game_start",this,function(data){
			this.gameView.startGame();
			startBtn.visible = false;
		}.bind(this));
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