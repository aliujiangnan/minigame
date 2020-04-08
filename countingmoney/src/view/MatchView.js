/**
* MatchView
*/
var MatchView = (function (_super) {
	function MatchView(playerSrc) {
		MatchView.__super.call(this);
		this.matchTime = 60;
		this.matchCount = 0;
		this.mouseThrough = false;
		this.initSelf();
	};

	var medalNames = ["bronze", "silver", "gold", "platinum", "diamond", "master", "king"];

	Laya.class(MatchView, "MatchView", _super);

	var __proto = MatchView.prototype;
	__proto.initSelf = function () {
		var bg = new Laya.Sprite();
		bg.loadImage("texture/view/match/bg_black.png");
		this.addChild(bg);

		var box = new Laya.Box();
		box.size(Laya.stage.width, Laya.stage.height);
		box.pivot(Global.stageWidth / 2, Global.stageHeight / 2);
		box.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		box.scale(Global.scaleX, Global.scaleY);
		this.addChild(box);
		this.container = box;

		var box1 = new Laya.Sprite();
		box1.loadImage("texture/view/match/box.png");
		box1.pivot(box1.width / 2, box1.height / 2);
		box1.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		box1.scaleX /= Global.scaleX;
		box1.visible = false;
		this.container.addChild(box1);
		this.box = box1;

		var bule = new Laya.Sprite();
		bule.loadImage("texture/view/match/bule.png");
		bule.pivot(bule.width / 2, bule.height / 2);
		bule.pos(Laya.stage.width / 2 - bule.width / 2 + 107 / 2, Laya.stage.height / 2 + 30);
		bule.visible = false;
		this.container.addChild(bule);
		this.bule = bule;

		var red = new Laya.Sprite();
		red.loadImage("texture/view/match/red.png");
		red.pivot(red.width / 2, red.height / 2);
		red.pos(Laya.stage.width / 2 + red.width / 2 - 107 / 2, Laya.stage.height / 2 + 30);
		red.visible = false;
		this.container.addChild(red);
		this.red = red;

		var match = new Laya.Sprite();
		match.loadImage("texture/view/match/matching.png");
		match.pivot(match.width / 2, match.height / 2);
		match.pos(this.box.x, this.box.y - this.box.height);
		this.container.addChild(match);
		this.matching = match;

		var countDown = new Laya.Sprite();
		countDown.loadImage("texture/view/match/countdown.png");
		countDown.pivot(0, countDown.height / 2);
		this.container.addChild(countDown);
		this.countDown = countDown;

		var countTxt = new Laya.Text();
		countTxt.text = "60s";
		countTxt.font = "match_countTxt_count-laya";
		countTxt.pivot(-countDown.width - 10, countTxt.height / 2);
		this.container.addChild(countTxt);
		countDown.pos(Laya.stage.width / 2 - (countDown.width + countTxt.width) / 2, this.matching.y + this.matching.height + countTxt.height);
		countTxt.pos(countDown.x, countDown.y);
		this.countTxt = countTxt;

		var round = new Laya.Sprite();
		round.loadImage("texture/view/end/round_1.png");
		round.pivot(round.width / 2, round.height / 2);
		round.pos(Laya.stage.width / 2, this.box.y);
		round.zOrder = 11;
		this.container.addChild(round);
		this.leftRound = round;

		var leftHead = new Laya.Sprite();
		leftHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
		leftHead.pivot(88 / 2, 88 / 2);
		leftHead.pos(this.leftRound.x, this.leftRound.y);
		leftHead.zOrder = 10;
		this.container.addChild(leftHead);
		this.leftHead = leftHead;

		var leftHead1 = new Laya.Sprite();
		leftHead1.pivot(88 / 2, 88 / 2);
		leftHead1.pos(this.leftRound.x, this.leftRound.y);
		leftHead1.zOrder = 10;
		this.container.addChild(leftHead1);
		this.leftHead1 = leftHead1;
		this.leftHead1.loadImage(UserMgr.instance.avatar, 0, 0, 88, 88, Laya.Handler.create(this, function () {
			leftHead.graphics.drawCircle(88 / 2, 88 / 2, 88 / 2, "#ffffff");
		}));

		var mask = new Laya.Sprite();
		mask.graphics.drawCircle(0, 0, 88 / 2, "#ffffff");
		mask.pos(88 / 2, 88 / 2);
		this.leftHead1.mask = mask;

		var round1 = new Laya.Sprite();
		round1.loadImage("texture/view/end/round_1.png");
		round1.pivot(round1.width / 2, round1.height / 2);
		round1.pos(this.leftRound.x, this.box.y);
		round1.zOrder = 11;
		round1.visible = false;
		this.container.addChild(round1);
		this.rightRound = round1;

		var rightHead = new Laya.Sprite();
		rightHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
		rightHead.pivot(88 / 2, 88 / 2);
		rightHead.pos(round1.x, round1.y);
		rightHead.zOrder = 10;
		rightHead.visible = false;
		this.container.addChild(rightHead);
		this.rightHead = rightHead;

		var rightHead1 = new Laya.Sprite();
		rightHead1.pivot(88 / 2, 88 / 2);
		rightHead1.pos(round1.x, round1.y);
		this.container.addChild(rightHead1);

		var mask1 = new Laya.Sprite();
		mask1.graphics.drawCircle(0, 0, 88 / 2, "#ffffff");
		mask1.pos(88 / 2, 88 / 2);
		rightHead1.mask = mask;
		rightHead1.zOrder = 10;
		rightHead1.visible = false;
		this.rightHead1 = rightHead1;

		var sp = new Laya.Sprite();
		this.container.addChild(sp);
		this.circleSp = sp;

		var fn = function () {
			if (this.circleSp == null) return;
			var circle = new Laya.Sprite();
			circle.loadImage("texture/view/match/guangyun.png")
			circle.pivot(circle.width / 2, circle.height / 2);
			circle.pos(this.leftRound.x, this.leftRound.y);
			this.circleSp.addChild(circle);
			circle.scale(0.5, 0.5);
			Laya.Tween.to(circle, { scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 2000, null, Laya.Handler.create(this, function () {
				circle.removeSelf();
				circle.destroy();
			}));

			Laya.timer.once(1000, this, fn);
		}.bind(this)
		fn();

		var sex = new Laya.Sprite();
		sex.loadImage("texture/game/sex_" + UserMgr.instance.sex + ".png");
		sex.pos(this.leftRound.x - 60, this.leftRound.y + 40);
		sex.pivot(15, 15);
		this.container.addChild(sex);
		this.leftSex = sex;

		var sex1 = new Laya.Sprite();
		sex1.pos(this.rightRound.x - 60, this.rightRound.y + 40);
		sex1.pivot(15, 15);
		this.container.addChild(sex1);
		sex1.visible = false;
		this.rightSex = sex1;

		var nameBg = new Laya.Sprite();
		nameBg.loadImage("texture/view/end/namedi.png");
		nameBg.pivot(nameBg.width / 2, nameBg.height / 2);
		nameBg.pos(this.leftRound.x, this.leftRound.y + 88);
		nameBg.zOrder = 10;
		this.container.addChild(nameBg);
		this.leftNameBg = nameBg;

		var nameBg1 = new Laya.Sprite();
		nameBg1.loadImage("texture/view/end/namedi.png");
		nameBg1.pivot(nameBg1.width / 2, nameBg1.height / 2);
		nameBg1.pos(this.rightRound.x, this.rightRound.y + 88);
		nameBg1.zOrder = 10;
		nameBg1.visible = false;
		this.container.addChild(nameBg1);
		this.rightNameBg = nameBg1;

		var level = UserMgr.instance.level;
		var medal = parseInt((level - 1) / 5);
		var medalName = "bronze_default";
		if (level > 31) {
			medalName = "king_2";
		}
		else if (level > 0) {
			medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
		}

		var badge = new Laya.Sprite();
		badge.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");
		badge.size(80, 80);
		badge.pivot(badge.width / 2, badge.height / 2);
		badge.pos(24, this.leftNameBg.height / 2);
		badge.scale(0.65, 0.65);
		badge.zOrder = 21;
		this.leftNameBg.addChild(badge);

		var badge1 = new Laya.Sprite();
		badge1.loadImage("texture/medal/profile_medal_bronze_default@1x.png");
		badge1.size(80, 80);
		badge1.pivot(badge1.width / 2, badge1.height / 2);
		badge1.pos(24, this.rightNameBg.height / 2);
		badge1.scale(0.65, 0.65);
		badge1.zOrder = 21;
		this.rightNameBg.addChild(badge1);
		this.rightBadge = badge1;

		var leftTxt = new Laya.Text();
		leftTxt.text = UserMgr.instance.nickName;
		leftTxt.text = leftTxt.text.length > 6 ? leftTxt.text.substr(0, 6) + ".." : leftTxt.text;
		leftTxt.fontSize = 24;
		leftTxt.width = 200;
		leftTxt.pivotX = 100;
		leftTxt.color = "#FFFFFF";
		leftTxt.align = "center";
		leftTxt.stroke = 1;
		leftTxt.zOrder = 11;
		leftTxt.strokeColor = "#FFFFFF"
		leftTxt.pos(nameBg.x, nameBg.y - 12);
		this.container.addChild(leftTxt);
		this.leftTxt = leftTxt;

		var rightTxt = new Laya.Text();
		rightTxt.fontSize = 24;
		rightTxt.width = 200;
		rightTxt.pivotX = 100;
		rightTxt.color = "#FFFFFF";
		rightTxt.align = "center";
		rightTxt.stroke = 1;
		rightTxt.strokeColor = "#FFFFFF";
		rightTxt.zOrder = 11;
		rightTxt.pos(nameBg1.x, nameBg1.y - 12);
		rightTxt.visible = false;
		this.container.addChild(rightTxt);
		this.rightTxt = rightTxt;

		this.loads = new Array(3);
		for (var i = 0; i < 3; i++) {
			this.loads[i] = new Laya.Sprite();
			this.loads[i].name = "point";
			this.loads[i].loadImage("texture/view/match/round.png");
			this.loads[i].zOrder = 11;
			this.loads[i].pivot(this.loads[i].width / 2, this.loads[i].height / 2);
			this.loads[i].pos(this.matching.x + (i - 1) * (this.loads[i].width * 2) + 175, this.matching.y + 34);
		}
		Laya.timer.loop(1000, this, this.onTimer);

		var btn = new Laya.Button("texture/view/match/button.png");
		btn.pos(Laya.stage.width / 2, Laya.stage.height / 4 * 3 - 60);
		btn.anchorX = 0.5;
		btn.anchorY = 0.5;
		btn.stateNum = 3;
		btn.clickHandler = new Laya.Handler(this, this.closeMatch);
		this.container.addChild(btn);
		this.closeBtn = btn;

		if(Global.testType == 0)
			Laya.timer.once(3000, this,this.matchSuccess)
		else {
			NetMgr.instance.send('match', {type:Global.gameType});
			EventHelper.instance.once("game_start",this,this.matchSuccess);
		}
	};

	__proto.closeMatch = function () {
		Laya.timer.clearAll(this);
		this.removeSelf();
		this.destroy();
	}

	__proto.onTimer = function () {
		if (this.matchTime-- <= 0) {
			this.matchTime = 0;
			Laya.timer.clearAll(this);
			this.closeMatch();
		}

		this.countTxt.text = this.matchTime + "s";
	}

	__proto.matching = function () {
		if (++this.matchCount > 3) {
			this.matchCount = 0;
		}
		for (var i = 0; i < this.loads.length; i++) {
			if (i < this.matchCount) {
				this.loads[i].visible = true;
			} else {
				this.loads[i].visible = false;
			}
		}
	}

	__proto.matchSuccess = function () {
		Laya.timer.clearAll(this);

		this.matching.visible = false;
		this.countDown.visible = false;
		this.countTxt.visible = false;
		this.closeBtn.visible = false;
		this.loads[0].visible = false;
		this.loads[1].visible = false;
		this.loads[2].visible = false;

		this.rightNameBg.visible = true;
		this.rightSex.visible = true;
		this.rightHead.visible = true;
		this.rightRound.visible = true;
		this.rightTxt.visible = true;

		this.container.removeChildByName("circleSp");
		var t = 600;
		var x = this.box.x - this.box.width / 4 - 100;
		Laya.Tween.to(this.leftRound, { x: x }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.leftNameBg, { x: x }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.leftTxt, { x: this.leftTxt.x - this.box.width / 4 - 100 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.leftSex, { x: x - 60 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.leftHead1, { x: x }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.leftHead, { x: x }, t, Laya.Ease.quintOut);

		this.box.y += 30;

		this.rightHead.visible = true;
		this.rightHead1.visible = true;

		var opponent = NetMgr.instance.getOpponent();
		this.rightHead1.pos(this.rightRound.x, this.rightRound.y);
		this.rightHead1.loadImage(opponent.avatar,0,0,88,88,Laya.Handler.create(this,function(){
			this.rightHead.graphics.drawCircle(88 / 2,88 / 2,88 / 2,"#ffffff");
		}));

		this.rightSex.loadImage("texture/game/sex_" + opponent.sex + ".png");

		var level = opponent.level;
		var medal = parseInt((level - 1) / 5);
		var medalName = "bronze_default";
		if (level > 31) {
			medalName = "king_2";
		}
		else if (level > 0) {
			medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
		}

		this.rightBadge.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");

		this.rightTxt.text = opponent.nickName;
		this.rightTxt.text = this.rightTxt.text.length > 6 ? this.rightTxt.text.substr(0, 6) + ".." : this.rightTxt.text;
		if (medalName) this.rightTxt.x += Math.max(0, this.rightTxt.text.length - 3) * 3.5;

		var x1 = this.box.x + this.box.width / 4 + 100;
		Laya.Tween.to(this.rightRound, { x: x1 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.rightNameBg, { x: x1 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.rightTxt, { x: this.rightTxt.x + this.box.width / 4 + 100 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.rightSex, { x: x1 - 60 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.rightHead1, { x: x1 }, t, Laya.Ease.quintOut);
		Laya.Tween.to(this.rightHead, { x: x1 }, t, Laya.Ease.quintOut);

		var t1 = 250;
		Laya.timer.once(t, this, function () {
			this.bule.visible = true;
			this.red.visible = true;
			this.bule.x -= Laya.stage.width / 2;
			this.red.x += Laya.stage.width / 2;

			var bo = new Laya.Sprite();
			bo.loadImage("texture/view/match/b.png");
			bo.pivot(bo.width / 2, bo.height / 2);
			bo.pos(Laya.stage.width / 2 - 80 - Laya.stage.width / 2, this.rightHead1.y + 80);
			this.container.addChild(bo);

			var bo1 = new Laya.Sprite();
			bo1.loadImage("texture/view/match/c.png");
			bo1.pivot(bo1.width / 2, bo1.height / 2);
			bo1.pos(Laya.stage.width / 2 + 80 + Laya.stage.width / 2, this.rightHead1.y - 30);
			this.container.addChild(bo1);

			Laya.Tween.to(this.bule, { x: this.bule.x + Laya.stage.width / 2 }, t1, Laya.Ease.elasticOut);
			Laya.Tween.to(this.red, { x: this.red.x - Laya.stage.width / 2 }, t1, Laya.Ease.elasticOut);
			Laya.Tween.to(bo, { x: bo.x + Laya.stage.width / 2 }, t1, Laya.Ease.elasticOut);
			Laya.Tween.to(bo1, { x: bo1.x - Laya.stage.width / 2 }, t1, Laya.Ease.elasticOut);
		});

		Laya.timer.once(t + t1, this, function () {
			var vs = new Laya.Sprite();
			vs.loadImage("texture/view/match/v.png");
			vs.pivot(vs.width / 2, vs.height / 2);
			vs.pos(Laya.stage.width / 2 - 30, this.rightHead1.y - 30);
			this.container.addChild(vs);
			vs.scale(0.1, 0.1);
			Laya.Tween.to(vs, { scaleX: 1, scaleY: 1 }, 50);
			var vs1 = new Laya.Sprite();
			vs1.loadImage("texture/view/match/s.png");
			vs1.pivot(vs1.width / 2, vs1.height / 2);
			vs1.pos(Laya.stage.width / 2 + 27, this.rightHead1.y + 47);
			this.container.addChild(vs1);
			vs1.scale(0.1, 0.1);
			Laya.Tween.to(vs1, { scaleX: 1, scaleY: 1 }, 50);
		})

		var find = new Laya.Sprite();
		find.loadImage("texture/game/find.png");
		find.pivot(find.width / 2, find.height / 2);
		find.pos(Laya.stage.width / 2, 320);
		this.container.addChild(find);
		this.find = find;

		var loading = new Laya.Sprite();
		loading.loadImage("texture/game/loading.png");
		loading.pivot(loading.width / 2, loading.height / 2);
		loading.pos(355, 395);
		this.container.addChild(loading);

		var sps = [];
		var count = 0;
		for (var i = 0; i < 3; ++i) {
			var round = new Laya.Sprite();
			round.loadImage("texture/game/round.png");
			round.pivot(round.width / 2, round.height / 2);
			round.pos(450 + 13 * i, 403);
			this.container.addChild(round);
			round.visible = false;
			sps.push(round);
		}
		Laya.timer.loop(500, this, function () {
			count++;
			if (count > 3) count = 0;
			for (var i = 0; i < sps.length; ++i)
				sps[i].visible = i < count;
		});

		Laya.timer.once(1500,this,function(){
			var view = new GameView();
			Laya.stage.addChild(view);
			view.startGame();
			this.removeSelf();
			this.destroy();
		}.bind(this))

	}

	return MatchView;
})(Laya.View)