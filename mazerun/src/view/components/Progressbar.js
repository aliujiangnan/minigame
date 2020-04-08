/**
* Progress
*/
var Progress = (function (_super) {
	function Progress(data, callback, callback1) {
		Progress.__super.call(this);
		this.initSelf(data, callback, callback1);
	}

	Laya.class(Progress, "Progress", _super);

	var __proto = Progress.prototype;
	__proto.initSelf = function (data, callback, callback1) {
		this.levelUp = data.befonext != data.nextexp;
		this.progress = data.befoexp / data.befonext * 100;
		this.rate = this.progress / 100;
		this.dst = data.curexp / data.nextexp;

		var bg = new Laya.Sprite();
		bg.loadImage("texture/view/end/progressBg.png");
		bg.pivot(bg.width / 2, bg.height / 2);
		this.addChild(bg);

		var bar = new Laya.Sprite();
		bar.name = "Progress";
		bar.loadImage("texture/view/end/progressF.png");
		bar.pivot(bar.width / 2, bar.height / 2);
		this.addChild(bar);
		
		var maskBg = new Laya.Sprite();
		maskBg.loadImage("texture/view/end/progressF.png");
		maskBg.pos(-maskBg.width / 2, 0);
		this.maskBg = maskBg;
		bar.mask = maskBg;

		var rateTxt = new Laya.Text();
		rateTxt.fontSize = 18;
		rateTxt.color = "#FFFFFF";
		rateTxt.stroke = 1;
		rateTxt.strokeColor = "#FFFFFF";
		rateTxt.align = "center";
		rateTxt.text = data.curexp + "/" + data.nextexp;
		if (this.levelUp) rateTxt.text = data.befoexp + "/" + data.befonext;
		rateTxt.pivot(rateTxt.width / 2, rateTxt.height / 2);
		rateTxt.pos(bg.x, bg.y);
		this.addChild(rateTxt);

		var dst = this.levelUp ? 1 : this.dst;
		var addExp = this.levelUp ? (data.curexp + data.befonext - data.befoexp) : data.curexp - data.befoexp;

		var addTxt = new Laya.Text();
		addTxt.text = data.expadd;
		addTxt.fontSize = 24;
		addTxt.width = 100;
		addTxt.pivotX = 0;
		addTxt.color = "#71C754";
		addTxt.stroke = 1;
		addTxt.strokeColor = "#71C754"
		addTxt.align = "left";
		addTxt.pos(bg.x + bg.width / 2 + 3, bg.y - 11);
		this.addChild(addTxt);

		this.grown = false;
		this.progressAni(this.rate * 100);
		if (this.levelUp) {
			rateTxt.text = parseInt(this.rate * data.befonext) + "/" + data.befonext;
		}
		else {
			rateTxt.text = parseInt(this.rate * data.nextexp) + "/" + data.nextexp;
		}

		var loopFunc = function (dst, levelUp, isLevelUp) {
			if (!this.grown) return;
			if (this.rate * 100 + 1 > dst * 100) {
				this.progressAni(dst * 100);
				Laya.timer.clear(this, loopFunc);
				if (isLevelUp) levelUp();
				else {
					rateTxt.text = data.curexp + "/" + data.nextexp;
					callback();
				}
			}
			else {
				this.progressAni(this.rate * 100 + 2.5);
				if (levelUp) {
					rateTxt.text = parseInt(this.rate * data.befonext) + "/" + data.befonext;
				}
				else {
					rateTxt.text = parseInt(this.rate * data.nextexp) + "/" + data.nextexp;
				}
			}
		}.bind(this);

		var levelUp = function () {
			if (this.levelUp) {
				callback1();
				this.progressAni(0);
				rateTxt.text = 0 + "/" + data.nextexp;;
				Laya.timer.frameLoop(1, this, loopFunc, [this.dst]);
			}
		}.bind(this);

		Laya.timer.frameLoop(1, this, loopFunc, [dst, levelUp, this.levelUp]);
	}

	__proto.progressAni = function (value) {
		var offRate = value / 100 - this.rate;
		if(offRate > 1) offRate -= 1;
		this.rate = value / 100;
		if (this.rate > 1) this.rate = 1;
		
		Laya.Tween.to(this.maskBg, { x: -this.maskBg.width * (1 - this.rate) }, 500 * offRate, null, Laya.Handler.create(this, function (value) {
			if (value > 100) {
				value -= 100;
				this.progress = value;
				this.rate = 0;
				this.maskBg.pos(-this.maskBg.width, 0);
				this.progressAni(value);
			}
		}.bind(this), [value]), 100);
	}

	return Progress;
})(Laya.Sprite)