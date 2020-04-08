/**
* OverView
*/
var OverView = (function (_super) {
	function OverView(result, data) {
		OverView.__super.call(this);
		this.result = result;
		this.data = data;
		this.initSelf(result, data);
		this.state = "over";
	}
	Laya.class(OverView, "OverView", _super);

	var medalLevel = ["V", "IV", "III", "II", "I"];
	var medalNames = ["bronze", "silver", "gold", "platinum", "diamond", "master", "king"];
	var medalNames1 = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "King"]
	var txts = ["Challenge me again.", "One more round?", "Bring it on!", "Come on, Bro!", "Wait for u in next round!"];

	var __proto = OverView.prototype;
	__proto.initSelf = function (result, data) {
		this.mouseThrough = false;

		var bg = new Laya.Sprite();
		bg.loadImage("texture/game/bg.png");
		this.addChild(bg);

		this.container = new Laya.Box();
		this.addChild(this.container);
		this.container.name = "container";
		this.container.size(Global.stageWidth, Global.stageHeight);
		this.container.pivot(Global.stageWidth / 2, Global.stageHeight / 2);
		this.container.pos(Global.stageWidth / 2, Global.stageHeight / 2 + 100);
		this.container.scale(Global.scaleX, Global.scaleY);
		this.container.scale(0.7 * Global.scaleX, 0.7 * Global.scaleY);
		Laya.Tween.to(this.container, { scaleX: 1.0 * Global.scaleX, scaleY: 1.0 * Global.scaleY }, 600, Laya.Ease.elasticOut);

		var light = new Laya.Sprite();
		light.loadImage(this.result == 1 ? "texture/view/end/victoryguang.png" : "texture/view/end/defatulguang.png");
		light.pivot(light.width / 2, light.height / 2);
		light.pos(375, 117);
		light.visible = false;
		light.scale(0.8, 0.8);
		this.container.addChild(light);

		var loopFunc = function () {
			Laya.Tween.to(light, { rotation: light.rotation + 180 }, 7000, null, Laya.Handler.create(self, loopFunc))
		}.bind(this)

		var t1 = this.result == 1 ? 450 : 0;
		Laya.timer.once(t1, this, function () {
			light.visible = this.result >= 1;
			loopFunc();
		})

		var posArr = [{ x: 274, y: 160 }, { x: 291, y: 120 }, { x: 375, y: 77 }, { x: 459, y: 120 }, { x: 476, y: 160 },];
		var posArr1 = [{ x: 225, y: 140 }, { x: 260, y: 77 }, { x: 375, y: 20 }, { x: 490, y: 77 }, { x: 525, y: 140 },];

		for (var i = 0; i < 5; i++) {
			var star = new Laya.Sprite();
			star.loadImage("texture/view/end/xingxing.png");
			star.pos(posArr[i].x, posArr[i].y);
			star.pivot(star.width / 2, star.height / 2);
			star.scale(0.5, 0.5);
			Laya.Tween.to(star, { x: posArr1[i].x, y: posArr1[i].y, scaleX: 1, scaleY: 1, alpha: 1 }, 300);
		}

		var box = new Laya.Sprite();
		box.loadImage(this.result >= 1 ? (this.result == 1 ? "texture/view/end/title_victory_box2.png" : "texture/view/end/title_draw_box2.png") : "texture/view/end/title_defatul_box2.png");
		box.pivot(box.width / 2, box.height / 2);
		box.pos(Laya.stage.width / 2, 80);
		this.container.addChild(box);

		var sword = new Laya.Sprite();
		sword.loadImage(this.result >= 1 ? (this.result == 1 ? "texture/view/end/victoryjian.png" : "texture/view/end/drawljian.png") : "texture/view/end/defatuljian.png");
		sword.pivot(sword.width / 2, sword.height / 2);
		sword.pos(Laya.stage.width / 2, 30);
		this.container.addChild(sword);

		var t2 = this.result == 1 ? 300 : 0;
		if (this.result == 1) {
			sword.visible = false;
			sword.scale(2, 2);
			Laya.timer.once(t1, this, function () {
				sword.visible = true;
				Laya.Tween.to(sword, { scaleX: 1, scaleY: 1 }, t2, Laya.Ease.backOut);
			})
		}

		var bo = new Laya.Sprite();
		bo.loadImage(this.result >= 1 ? "texture/view/end/wofangying.png" : "texture/view/end/wofangshu.png");
		bo.pivot(bo.width / 2, bo.height / 2);
		bo.pos(Laya.stage.width / 2 - 570, 80);
		bo.visible = false;
		this.container.addChild(bo);
		var t3 = this.result == 1 ? 400 : 0;
		Laya.timer.once(t1 + t2, this, function () {
			if (this.result >= 1) bo.visible = true;
			Laya.Tween.to(bo, { x: bo.x + 400 }, t3, Laya.Ease.backOut)
		})

		var bo1 = new Laya.Sprite();
		bo1.loadImage(this.result >= 1 ? "texture/view/end/duifangshu.png" : "texture/view/end/duifangying.png");
		bo1.pivot(bo1.width / 2, bo1.height / 2);
		bo1.pos(Laya.stage.width / 2 + 610, 80);
		this.container.addChild(bo1);
		bo1.visible = false;
		Laya.timer.once(t1 + t2, this, function () {
			if (this.result >= 1) bo1.visible = true;
			Laya.Tween.to(bo1, { x: bo1.x - 400 }, t3, Laya.Ease.backOut)
		})

		var lifeBox = new Laya.Sprite();
		lifeBox.loadImage("texture/view/end/lifeBox.png");
		lifeBox.pivot(lifeBox.width / 2, lifeBox.height / 2);
		lifeBox.pos(Global.stageWidth / 2, Global.stageHeight / 2.2);
		this.container.addChild(lifeBox);

		var bg1 = new Laya.Sprite();
		bg1.loadImage("texture/view/end/di2.png");
		bg1.pivot(bg1.width / 2, bg1.height / 2);
		bg1.pos(Global.stageWidth / 2, Global.stageHeight / 2.2 - 200 - 20 + 15 - 20);
		this.container.addChild(bg1);

		var icon = new Laya.Sprite();
		icon.loadImage("texture/view/end/icondi.png");
		icon.pivot(icon.width / 2, icon.height / 2);
		icon.pos(119, 287);
		icon.zOrder = 10;
		this.container.addChild(icon);

		var icon1 = new Laya.Sprite();
		icon1.loadImage("texture/view/end/iconwai.png");
		icon1.pivot(icon1.width / 2, icon1.height / 2);
		icon1.pos(119, 287);
		this.container.addChild(icon1);

		var tier = new Laya.Sprite();
		tier.loadImage("texture/view/end/tiersb.png");
		tier.pivot(tier.width / 2, tier.height / 2);
		tier.pos(417, 285);
		this.container.addChild(tier);

		var gameName = new Laya.Text();
		gameName.text = Global.gameName;
		gameName.fontSize = 28;
		gameName.width = 300;
		gameName.pivotX = 150;
		gameName.color = "#7E66F0";
		gameName.stroke = 1;
		gameName.strokeColor = "#7E66F0"
		gameName.align = "left";
		gameName.pos(328, 254);
		this.container.addChild(gameName);

		var headBg = new Laya.Sprite();
		headBg.loadImage("texture/view/end/round_1.png");
		headBg.pivot(headBg.width / 2, headBg.height / 2);
		headBg.pos(Global.stageWidth / 2 + headBg.width / 2 + 85, lifeBox.y - lifeBox.height / 2 - headBg.height / 2 + 523);
		headBg.zOrder = 10;
		this.leftHeadBg = headBg;
		this.container.addChild(headBg);

		var leftHead = new Laya.Sprite();
		leftHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
		leftHead.pivot(88 / 2, 88 / 2);
		leftHead.pos(this.leftHeadBg.x, this.leftHeadBg.y);
		this.container.addChild(leftHead);

		var leftHead1 = new Laya.Sprite();
		leftHead1.loadImage(UserMgr.instance.avatar, 0, 0, 88, 88, Laya.Handler.create(this, function () {
			leftHead.graphics.drawCircle(88 / 2, 88 / 2, 88 / 2, "#ffffff");
		}));
		leftHead1.pivot(88 / 2, 88 / 2);
		leftHead1.pos(this.leftHeadBg.x, this.leftHeadBg.y);
		this.container.addChild(leftHead1);

		var mask = new Laya.Sprite();
		mask.graphics.drawCircle(0, 0, leftHead1.width / 2, "#ffffff");
		mask.pos(leftHead1.width / 2, leftHead1.height / 2);
		leftHead1.mask = mask;

		var headBg1 = new Laya.Sprite();
		headBg1.loadImage("texture/view/end/round_1.png");
		headBg1.pivot(headBg1.width / 2, headBg1.height / 2);
		headBg1.pos(Global.stageWidth / 2 - this.leftHeadBg.width / 2 - 85, lifeBox.y - lifeBox.height / 2 - headBg1.height / 2 + 520 - 5 - 20 + 30);
		this.container.addChild(headBg1);
		headBg1.zOrder = 10;

		var rightHead = new Laya.Sprite();
		rightHead.loadImage("texture/game/head_1.png", 0, 0, 88, 88);
		rightHead.pivot(88 / 2, 88 / 2);
		rightHead.pos(headBg1.x, headBg1.y);
		this.container.addChild(rightHead);

		var opponent = NetMgr.instance.getOpponent();
		var rightHead1 = new Laya.Sprite();
		rightHead1.loadImage(opponent.avatar, 0, 0, 88, 88, Laya.Handler.create(this, function () {
			rightHead.graphics.drawCircle(88 / 2, 88 / 2, 88 / 2, "#ffffff");
		}));
		rightHead1.pivot(88 / 2, 88 / 2);
		rightHead1.pos(headBg1.x, headBg1.y);

		var mask = new Laya.Sprite();
		mask.graphics.drawCircle(0, 0, rightHead1.width / 2, "#ffffff");
		mask.pos(rightHead1.width / 2, rightHead1.height / 2);
		rightHead1.mask = mask;
		this.container.addChild(rightHead1);

		var sex = new Laya.Sprite();
		sex.loadImage("texture/game/sex_" + UserMgr.instance.sex + ".png");
		sex.pos(headBg1.x - 60, headBg1.y + 40);
		sex.pivot(15, 15);
		this.container.addChild(sex);

		var sex1 = new Laya.Sprite();
		sex1.loadImage("texture/game/sex_" + opponent.sex + ".png");
		sex1.pos(this.leftHeadBg.x - 60, this.leftHeadBg.y + 40);
		sex1.pivot(15, 15);
		this.container.addChild(sex1);

		var scoresTxt = new Laya.Text();
		scoresTxt.text = (Global.scores[0] + (this.result == 1 ? 1 : 0)) + ":" + (Global.scores[1] + (this.result == 0 ? 1 : 0));
		scoresTxt.fontSize = 24;
		scoresTxt.width = 400;
		scoresTxt.pivotX = 200;
		scoresTxt.font = "newend-bf-laya";
		scoresTxt.align = "center";
		scoresTxt.pos(371, this.leftHeadBg.y - 35);
		scoresTxt.scale(1.2, 1.2);
		this.container.addChild(scoresTxt);

		if (this.result != 2) {
			if (this.result == 1) Global.scores[0] += 1;
			else Global.scores[1] += 1;
		}

		var nameBg = new Laya.Sprite();
		nameBg.loadImage("texture/view/end/namedi.png");
		nameBg.pivot(nameBg.width / 2, nameBg.height / 2);
		nameBg.pos(headBg1.x, headBg1.y + 90);
		nameBg.zOrder = 10;
		this.container.addChild(nameBg);
		nameBg.visible = !Global.isPreVer;

		var nameBg1 = new Laya.Sprite();
		nameBg1.loadImage("texture/view/end/namedi.png");
		nameBg1.pivot(nameBg1.width / 2, nameBg1.height / 2);
		nameBg1.pos(this.leftHeadBg.x, this.leftHeadBg.y + 90);
		nameBg1.zOrder = 10;
		this.container.addChild(nameBg1);
		nameBg1.visible = !Global.isPreVer;

		var len = 6;
		var nameTxt = new Laya.Text();
		nameTxt.text = UserMgr.instance.nickName;
		nameTxt.text = nameTxt.text.length > len ? nameTxt.text.substr(0, len) + ".." : nameTxt.text;
		nameTxt.fontSize = 24;
		nameTxt.width = 200;
		nameTxt.pivotX = 100;
		nameTxt.color = "#FFFFFF";
		nameTxt.align = "center";
		nameTxt.zOrder = 11;
		nameTxt.pos(nameBg.x, nameBg.y - 12);
		if (medalName) nameTxt.x += Math.max(0, nameTxt.text.length - 3) * 3.5;
		this.container.addChild(nameTxt);
		nameTxt.visible = !Global.isPreVer;

		var nameTxt1 = new Laya.Text();
		nameTxt1.text = opponent.nickName;
		nameTxt1.text = nameTxt1.text.length > len ? nameTxt1.text.substr(0, len) + ".." : nameTxt1.text;
		nameTxt1.fontSize = 24;
		nameTxt1.width = 200;
		nameTxt1.pivotX = 100;
		nameTxt1.color = "#FFFFFF";
		nameTxt1.align = "center";
		nameTxt1.zOrder = 11;
		nameTxt1.pos(nameBg1.x, nameBg1.y - 12);
		nameTxt1.x += Math.max(0, nameTxt1.text.length - 3) * 3.5;
		this.container.addChild(nameTxt1);
		nameTxt1.visible = !Global.isPreVer;

		var title = new Laya.Sprite();
		title.loadImage(this.result >= 1 ? (this.result == 1 ? "texture/view/end/title_victory_box.png" : "texture/view/end/title_draw_box.png") : "texture/view/end/title_defatul_box.png");
		title.pivot(title.width / 2, title.height / 2);
		title.pos(lifeBox.x, lifeBox.y - lifeBox.height / 2);
		title.zOrder = 10;
		this.container.addChild(title);

		var scoreTxt = new Laya.Text();
		scoreTxt.font = "newend-zf-laya";
		scoreTxt.text = "" + data.curscore;
		scoreTxt.pivot(scoreTxt.width / 2, scoreTxt.height / 2);
		scoreTxt.pos(lifeBox.x - lifeBox.width / 4, lifeBox.y - lifeBox.height / 4 + 5);
		scoreTxt.visible = false;
		scoreTxt.scale(0, 0);
		this.container.addChild(scoreTxt);
		var t4 = 300;
		Laya.timer.once(t1 + t2 + t3, this, function () {
			scoreTxt.visible = true;
			Laya.Tween.to(scoreTxt, { scaleX: 1.2, scaleY: 1.2 }, t4, Laya.Ease.backOut);
		})

		var score = new Laya.Sprite();
		score.loadImage("texture/view/end/score_.png");
		score.pivot(score.width / 2, score.height / 2);
		score.pos(scoreTxt.x + 12, scoreTxt.y + scoreTxt.height - 155);
		this.container.addChild(score);

		var rateTxt = new Laya.Text();
		rateTxt.color = this.result > 0 ? "#71C754" : "#F4504A";
		rateTxt.fontSize = 24;
		rateTxt.stroke = 1;
		rateTxt.strokeColor = this.result > 0 ? "#71C754" : "#F4504A";
		rateTxt.text = data.scoreadd;
		rateTxt.pivot(rateTxt.width / 2, rateTxt.height / 2);
		rateTxt.pos(score.x + score.width / 2 + rateTxt.width / 2 + 6, score.y + 3);
		this.container.addChild(rateTxt);

		var sui = new Laya.Sprite;
		sui.loadImage("texture/view/end/sui.png");
		sui.size(80, 80);
		sui.pivot(sui.width / 2, sui.height / 2);
		sui.pos(lifeBox.x + lifeBox.width / 4 - 60, scoreTxt.y + 2);
		sui.zOrder = 21;
		this.container.addChild(sui);

		var tiers = new Laya.Text();
		tiers.text = "Tiers";
		tiers.fontSize = 28;
		tiers.width = 100;
		tiers.pivotX = 50;
		tiers.color = "#7E66F0";
		tiers.align = "center";
		tiers.stroke = 1;
		tiers.strokeColor = "#7E66F0"
		tiers.pos(486, 269);
		this.container.addChild(tiers);

		var level = data.curlv;
		UserMgr.instance.level = level;
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
		badge.pos(24, nameBg.height / 2);
		badge.scale(0.65, 0.65);
		badge.zOrder = 21;
		nameBg.addChild(badge);

		var levelTxt = new Laya.Text();
		levelTxt.fontSize = 24;
		levelTxt.font = "t-laya";
		levelTxt.width = 100;
		levelTxt.pivotX = 50;
		levelTxt.align = "center";
		levelTxt.color = "#ffffff";
		levelTxt.pos(badge.width / 2, badge.height / 2 + 5);
		levelTxt.zOrder = 22;
		badge.addChild(levelTxt);
		if (level > 31) {
			levelTxt.text = "" + (level - 31);
		}

		level = opponent.level;
		medal = parseInt((level - 1) / 5);
		medalName = "bronze_default";
		if (level > 31) {
			medalName = "king_2";
		}
		else if (level > 0) {
			medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
		}

		var path1 = "texture/medal/profile_medal_" + medalName + "@1x.png";
		var badge1 = new Laya.Sprite();
		badge1.loadImage(path1);
		badge1.size(80, 80);
		badge1.pivot(badge1.width / 2, badge1.height / 2);
		badge1.pos(24, nameBg.height / 2);
		badge1.scale(0.65, 0.65);
		badge1.zOrder = 21;
		nameBg1.addChild(badge1);

		var levelTxt1 = new Laya.Text();
		levelTxt1.fontSize = 24;
		levelTxt1.font = "t-laya";
		levelTxt1.width = 100;
		levelTxt1.pivotX = 50;
		levelTxt1.align = "center";
		levelTxt1.color = "#ffffff";
		levelTxt1.pos(badge1.width / 2, badge1.height / 2 + 5);
		levelTxt1.zOrder = 22;
		badge1.addChild(levelTxt1);

		if (level > 31) {
			levelTxt1.text = "" + (level - 31);
		}

		var levelUp = data.befonext != data.nextexp;
		level = levelUp ? data.curlv - 1 : data.curlv;
		medal = parseInt((level - 1) / 5);
		medalName = "bronze_default";
		var medalName1 = "";
		if (level > 31) {
			medalName = "king_2";
			medalName1 = "King";
		}
		else if (level > 0) {
			medalName = medalNames[medal] + "_" + ((level - 1) % 5 + 1);
			medalName1 = medalNames1[medal];
		}

		var badge2 = new Laya.Sprite();
		badge2.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");
		badge2.size(80, 80);
		badge2.pivot(badge2.width / 2, badge2.height / 2);
		badge2.pos(lifeBox.x + lifeBox.width / 4 - 2, scoreTxt.y - 15 - 15 + 30 - 5);
		badge2.zOrder = 21;
		badge2.visible = false;
		badge2.scale(0.0, 0.0);
		this.container.addChild(badge2);
		this.badge = badge2;

		var t5 = 200;
		Laya.timer.once(t1 + t2 + t3 + t4, this, function () {
			badge2.visible = true;
			Laya.Tween.to(badge2, { scaleX: 1.35, scaleY: 1.35 }, t4, Laya.Ease.backOut);
		})

		var medalTxt = new Laya.Text();
		medalTxt.text = medalName1 == "" ? "" : medalName1 + " " + (level > 31 ? "" : medalLevel[(level - 1) % 5]);
		medalTxt.fontSize = 24;
		medalTxt.width = 200;
		medalTxt.pivotX = 100;
		medalTxt.color = "#6b6b6b";
		medalTxt.stroke = 1;
		medalTxt.strokeColor = "#6b6b6b"
		medalTxt.align = "center";
		medalTxt.pos(badge2.x, 430);
		this.container.addChild(medalTxt);
		this.medalTxt = medalTxt;

		var levelTxt1 = new Laya.Text();
		levelTxt1.fontSize = 24;
		levelTxt1.width = 100;
		levelTxt1.pivotX = 50;
		levelTxt1.align = "center";
		levelTxt1.color = "#ffffff";
		levelTxt1.pos(badge2.width / 2, badge2.height / 2 + 5);
		levelTxt1.zOrder = 22;
		badge2.addChild(levelTxt1);
		if (level > 31) {
			levelTxt1.text = "" + (level - 31);
		}

		var progressBar = new Progress(this.data, this.loopFunc.bind(this), this.changeMedal.bind(this));
		progressBar.pos(badge2.x - 20, badge2.y + badge2.height / 2 + 75);
		progressBar.visible = false;
		progressBar.scale(0.5, 0.5);
		this.container.addChild(progressBar);

		var t6 = 200;
		Laya.timer.once(t1 + t2 + t3 + t4 + t5, this, function () {
			progressBar.visible = true;
			Laya.Tween.to(progressBar, { scaleX: 1, scaleY: 1 }, t6, Laya.Ease.backOut);
		})

		Laya.timer.once(t1 + t2 + t3 + t4 + t5 + t6, this, function () {
			progressBar.grown = true;
		})

		var rankBtn = new Laya.Button();
		rankBtn.anchorX = 0.5;
		rankBtn.anchorY = 0.5;
		rankBtn.stateNum = 3;
		rankBtn.name = "btn_rank";
		rankBtn.skin = ("texture/view/end/bt_rank.png");
		rankBtn.pos(330, 490);
		rankBtn.zOrder = 21;
		rankBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [rankBtn], false);
		this.container.addChild(rankBtn);
		this.rankBtn = rankBtn;

		var helpBtn = new Laya.Button();
		helpBtn.anchorX = 0.5;
		helpBtn.anchorY = 0.5;
		helpBtn.stateNum = 3;
		helpBtn.name = "btn_help";
		helpBtn.skin = ("texture/view/end/bt_help.png");
		helpBtn.pos(645, 280);
		helpBtn.zOrder = 21;
		helpBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [helpBtn], false);
		this.container.addChild(helpBtn);

		var againBtn = new Laya.Button("texture/view/end/bt_playagain.png");
		againBtn.anchorX = 0.5;
		againBtn.anchorY = 0.5;
		againBtn.name = "btn_again";
		againBtn.stateNum = 3;
		againBtn.pos(lifeBox.x, Global.stageHeight / 8 * 6 - 147);
		this.container.addChild(againBtn);
		this.againBtn = againBtn;
		this.againBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [againBtn], false);

		var changeBtn = new Laya.Button("texture/view/end/bt_change.png");
		changeBtn.anchorX = 0.5;
		changeBtn.anchorY = 0.5;
		changeBtn.name = "btn_change";
		changeBtn.pos(lifeBox.x, this.againBtn.y + changeBtn.height / 2 + this.againBtn.height - 25);
		changeBtn.stateNum = 3;
		changeBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [changeBtn], false);
		this.container.addChild(changeBtn);
		this.changeBtn = changeBtn;

		var homeBtn = new Laya.Button();
		homeBtn.anchorX = 0.5;
		homeBtn.anchorY = 0.5;
		homeBtn.skin = ("texture/view/end/bt_home.png");
		homeBtn.stateNum = 3;
		homeBtn.name = "btn_home";
		homeBtn.pos(lifeBox.x, this.changeBtn.y + homeBtn.height / 2 + this.changeBtn.height + 5);
		homeBtn.clickHandler = new Laya.Handler(this, this.onBtnFunc, [homeBtn], false);
		this.container.addChild(homeBtn);

		this.canLoop = true;
		this.canLoop1 = true;

		if (Global.robotType == 1 || !opponent.online) {
			this.onOpponentLeft();
		}

		EventHelper.instance.once("player_again",this, this.onAgainEvent)
	};

	__proto.changeMedal = function () {
		var x = this.badge.x;
		var y = this.badge.y;
		Laya.Tween.to(this.badge, { alpha: 0, x: x - 100 }, 500);

		var medal = parseInt((this.data.curlv - 1) / 5);
		var medalName = "bronze_default";
		var medalName1 = "";
		if (this.data.curlv > 31) {
			medalName = "king_2";
			medalName1 = "King";
		}
		else if (this.data.curlv > 0) {
			medalName = medalNames[medal] + "_" + ((this.data.curlv - 1) % 5 + 1);
			medalName1 = medalNames1[medal];
		}

		var badge = new Laya.Sprite();
		badge.loadImage("texture/medal/profile_medal_" + medalName + "@1x.png");
		badge.size(80, 80);
		badge.pivot(badge.width / 2, badge.height / 2);
		badge.pos(x, y);
		badge.zOrder = 21;
		badge.alpha = 0;
		badge.x += 100;
		badge.scale(1.35, 1.35);
		this.container.addChild(badge);
		Laya.Tween.to(badge, { alpha: 1, x: badge.x - 100 }, 500);

		var txt = new Laya.Text();
		txt.fontSize = 24;
		txt.width = 100;
		txt.pivotX = 50;
		txt.align = "center";
		txt.color = "#ffffff";
		txt.pos(badge.width / 2, badge.height / 2 + 5);
		txt.zOrder = 22;
		badge.addChild(txt);

		if (this.data.curlv > 31) {
			txt.text = "" + (this.data.curlv - 31);
		}

		this.medalTxt.text = medalName1 + " " + (this.data.curlv > 31 ? "" : medalLevel[(this.data.curlv - 1) % 5]);
	};

	__proto.doLoop = function () {
		if (this.canLoop)
			Laya.timer.once(1000, this, this.loopFunc);
	};

	__proto.loopFunc = function () {
		if (!this.canLoop) return;
		Laya.Tween.to(this.againBtn, { scaleX: 0.95, scaleY: 0.95 }, 100, Laya.Ease.sineOut, Laya.Handler.create(this, function () {
			Laya.Tween.to(this.againBtn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
				Laya.Tween.to(this.againBtn, { scaleX: 0.95, scaleY: 0.95 }, 100, Laya.Ease.sineOut, Laya.Handler.create(this, function () {
					Laya.Tween.to(this.againBtn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.sineIn);
				}))
			}))
		}))
	};

	__proto.onBtnFunc = function (sender) {
		switch (sender.name) {
			case "btn_home":
				Global.scores = [0, 0];
				this.removeSelf();
				this.destroy();
				break;
			case "btn_change":
				var view = Laya.stage.addChild(new MatchView());
				if(NetMgr.instance.roomId != null){
					NetMgr.instance.send("dissolve");
					EventHelper.instance.once("game_dissolve",this, function(){
						NetMgr.instance.send('match', {type:Global.gameType});
					});
				}
				else{
					NetMgr.instance.send('match', {type:Global.gameType});
				}
					
				EventHelper.instance.once("game_start",this, function(){
					this.removeSelf();
					this.destroy();
				}.bind(this));
				break;
			case "btn_again":
				this.againBtn.skin = "texture/view/end/bt_wait.png";
				this.againBtn.stateNum = 1;
				this.againBtn.zOrder = 10;
				this.state = "again";

				if (Global.testType == 0) return;
				else NetMgr.instance.send("again");
				
				EventHelper.instance.once("game_start",this, function(){
					var view = new GameView();
					Laya.stage.addChild(view);
					view.startGame();
					this.removeSelf();
					this.destroy();
				});
				break;
			case "btn_accept":
				Laya.timer.clearAll(this);
				NetMgr.instance.send("accept");

				EventHelper.instance.once("game_start",this, function(){
					var view = new GameView();
					Laya.stage.addChild(view);
					view.startGame();
					this.removeSelf();
					this.destroy();
				});
				break;
			case "btn_help":
				break;
			case "btn_rank":
				break;
		}
	};

	__proto.onOpponentLeft = function () {
		Global.scores = [0, 0];
		this.canLoop = false;
		this.canLoop1 = false;
		this.againBtn.skin = "texture/view/end/bt_you.png";
		this.againBtn.stateNum = 1;
		this.againBtn.zOrder = 10;
		this.againBtn.clickHandler = null;
		this.rankBtn.visible = true;
	};

	__proto.onAgainEvent = function () {
		this.canLoop = false;

		var your = new Laya.Image();
		your.skin = "texture/view/end/bt_your.png";
		your.pivot(your.width / 2, your.height);
		your.pos(this.leftHeadBg.x + 10, this.leftHeadBg.y - 73 + your.height / 2 - 5);
		your.zOrder = 21;
		your.scaleY = 0;
		your.scaleX = 0;
		Laya.Tween.to(your, { scaleY: 1, scaleX: 1 }, 150, null);

		var txt = new Laya.Text();
		txt.fontSize = 24;
		txt.stroke = 1;
		txt.width = 300;
		txt.pivotX = 150;
		txt.color = "#FB5776";
		txt.strokeColor = "#FB5776";
		txt.text = txts[parseInt(Math.random() * 5)];
		txt.align = "center";
		txt.pos(your.width / 2, 32);
		txt.rotation = 3.5;
		your.addChild(txt);

		this.container.addChild(your);
		this.againBtn.skin = "texture/view/end/bt_accept.png";
		this.againBtn.stateNum = 3;
		this.againBtn.zOrder = 10;
		Laya.timer.clear(this, this.loopFunc);
		this.againBtn.scale(1, 1);
		this.againBtn.name = "btn_accept";
		var loopFunc = function () {
			if (!this.canLoop1) return;
			Laya.Tween.to(this.againBtn, { scaleX: 1.05, scaleY: 1.05 }, 100, Laya.Ease.sineOut, Laya.Handler.create(this, function () {
				Laya.Tween.to(this.againBtn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
					Laya.Tween.to(this.againBtn, { scaleX: 1.05, scaleY: 1.05 }, 100, Laya.Ease.sineOut, Laya.Handler.create(this, function () {
						Laya.Tween.to(this.againBtn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.sineIn);
					}))
				}))
			}))
		}

		Laya.timer.loop(1000, this, loopFunc);
	}

	return OverView;
})(Laya.View)