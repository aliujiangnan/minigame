window.__require = function e(t, n, i) {
function a(c, o) {
if (!n[c]) {
if (!t[c]) {
var r = c.split("/");
r = r[r.length - 1];
if (!t[r]) {
var l = "function" == typeof __require && __require;
if (!o && l) return l(r, !0);
if (s) return s(r, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var d = n[c] = {
exports: {}
};
t[c][0].call(d.exports, function(e) {
return a(t[c][1][e] || e);
}, d, d.exports, e, t, n, i);
}
return n[c].exports;
}
for (var s = "function" == typeof __require && __require, c = 0; c < i.length; c++) a(i[c]);
return a;
}({
AdView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "05462f7zV1KVbkAZKr/KLZs", "AdView");
cc.Class({
extends: cc.Component,
properties: {
arrow: {
default: null,
type: cc.Node
},
time: {
default: null,
type: cc.Node
},
btnPlay: {
default: null,
type: cc.Node
},
btnSkip: {
default: null,
type: cc.Node
}
},
start: function() {},
init: function() {
if (0 == gameInstance.gameView.modelType) {
this.arrow.active = !0;
this.time.active = !1;
} else {
this.arrow.active = !1;
this.time.active = !0;
}
this.btnPlay.stopAllActions();
this.btnSkip.stopAllActions();
this.btnSkip.opacity = 0;
this.btnPlay.scale = 1;
this.btnPlay.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.1), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.delayTime(2))));
this.scheduleOnce(function() {
this.btnSkip.runAction(cc.fadeIn(.3));
}.bind(this), 2);
},
onBtnPlay: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.sdkHelper.showAd(2, function(e) {
if ("played" == e) {
gameInstance.gameView.revive();
this.node.active = !1;
}
}.bind(this));
},
onBtnSkip: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
gameInstance.overView.node.active = !0;
gameInstance.overView.init();
}
});
cc._RF.pop();
}, {} ],
Arrow: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ae03f6MAh5ErLq20i3bb+Al", "Arrow");
var i = e("../Utils/Utils");
e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
moving: {
default: !1,
visible: !1
},
speed: {
default: 0,
visible: !1
},
gravity: {
default: -10,
visible: !1
},
time: {
default: 0,
visible: !1
},
startPos: {
default: cc.v2(0, 0),
visible: !1
},
anchor: {
default: null,
type: cc.Node
},
anchor1: {
default: null,
type: cc.Node
},
hitX: {
default: null,
type: cc.Node
},
hitXs: {
default: [],
type: [ cc.Node ]
}
},
onLoad: function() {
this.gravity = -50;
},
start: function() {},
update: function(e) {},
phyUpdate: function() {
if (this.moving) {
this.time += .01;
var e = this.node.position;
this.node.position = cc.v2(this.startPos.x + 60 * this.speed * this.time * Math.cos(i.getRad(this.angle)), this.startPos.y + 60 * this.speed * this.time * Math.sin(i.getRad(this.angle)) + .5 * this.gravity * this.time * this.time * 100);
var t = i.getS2TAngle(this.node.position.x, e.x, this.node.position.y, e.y, 1);
this.node.rotation = t;
var n = this.anchor.convertToWorldSpaceAR(cc.v2(0, 0));
this.node.position.x > 400 && (gameInstance.gameView.player.shootEnable = !0);
if (this.node.position.x > 500) {
this.moving = !1;
this.node.parent = null;
0 == gameInstance.gameView.arrowNum && gameInstance.gameView.gameOver();
} else if (n.y - gameInstance.canvas.node.height / 2 < -250) {
this.moving = !1;
var a = gameInstance.gameView.roadContents[gameInstance.gameView.curIndex];
this.node.parent = a;
this.node.position = a.convertToNodeSpaceAR(n);
this.node.anchorX = 1;
this.ground();
gameInstance.gameView.player.shootEnable = !0;
0 == gameInstance.gameView.arrowNum && gameInstance.gameView.gameOver();
}
for (var s = gameInstance.gameView.getCurLevelInfo(), c = gameInstance.gameView.getCurTargetsInfo(), o = 0 != s.polyType ? 10 : 3, r = 0; r < c.length; ++r) {
var l = (0 != s.polyType ? gameInstance.gameView.polyTargets : gameInstance.gameView.targets)[gameInstance.gameView.curIndex * o + r];
if (l.node.active) {
var d = 0 != s.polyType ? l.node : l.head, u = d.convertToWorldSpaceAR(cc.v2(0, 0)), h = this.anchor1.convertToWorldSpaceAR(cc.v2(0, 0)), p = d.height;
if (n.x > u.x - 40 && h.x < u.x - 40 && n.y > u.y - p / 2 && n.y < u.y + p / 2) {
var g = cc.instantiate(this.hitX);
g.parent = d;
g.position = d.convertToNodeSpaceAR(n);
var m = -3 - g.x, f = m * Math.tan(i.getRad(360 - this.node.rotation));
console.log("offsetX=" + m + "offsetY=" + f + "rotation=" + this.node.rotation);
g.position = cc.v2(-3, g.y + f);
g.active = !0;
this.hitXs.push(g);
if ("false" == l.penetratable) {
this.moving = !1;
this.node.parent = d;
this.node.position = g.position;
this.node.anchorX = 1;
this.rock();
0 == s.polyType && l.rock();
gameInstance.soundManager.playSound("hit2");
} else l.hit || l.explode();
if (!l.hit) {
if ("true" == l.mustShoot) {
var v = 10, y = Math.abs(g.y), I = 2;
if (y < p / 7 * .5) {
v = 30;
I = 0;
gameInstance.soundManager.playSound("hit1");
} else if (y < p / 7 * 1.5) {
v = 20;
I = 1;
} else y < p / 7 * 2.5 && (v = 10);
l.hit = !0;
console.log("offset === " + y);
gameInstance.gameView.curHitNum++;
"true" == l.penetratable && gameInstance.gameView.curHitNum == gameInstance.gameView.getCurMustShoot() && gameInstance.gameView.move();
2 != l.skinType && gameInstance.gameView.addScore(v, l);
l.playPart(I);
0 == I && gameInstance.gameView.showBoomFire();
}
l.hit = !0;
}
}
}
}
} else this.unschedule(this.phyUpdate, this);
},
shoot: function(e, t) {
this.angle = e;
this.speed = t;
this.startPos = this.node.position;
this.moving = !0;
this.schedule(this.phyUpdate, .01);
},
rock: function() {
this.node.runAction(cc.sequence(cc.rotateBy(.2, 10).easing(cc.easeSineOut()), cc.rotateBy(.2, -17.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, 12.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, -7.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, 2.5).easing(cc.easeSineIn()), cc.callFunc(function() {
0 == gameInstance.gameView.arrowNum && gameInstance.gameView.gameOver();
gameInstance.gameView.curHitNum == gameInstance.gameView.getCurMustShoot() && gameInstance.gameView.move();
gameInstance.gameView.player.shootEnable = !0;
}.bind(this))));
},
ground: function() {
this.node.runAction(cc.spawn(cc.rotateTo(.75, 0).easing(cc.easeBounceOut()), cc.moveBy(.75, cc.v2(400 * Math.cos(i.getRad(this.node.rotation)), 0))));
},
clearSelf: function() {
this.node.parent = null;
for (var e = 0; e < this.hitXs.length; ++e) this.hitXs[e].parent = null;
this.hitXs = [];
}
});
cc._RF.pop();
}, {
"../Utils/Utils": "Utils",
"../game/PlayerInfo": "PlayerInfo"
} ],
AwardView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "be1d8joQOxB3aAtVcRzZ/99", "AwardView");
var i = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
new: {
default: null,
type: cc.Node
},
skinSpr: {
default: null,
type: cc.Sprite
},
index: {
default: 0,
visible: !1
},
ui_skin: {
default: null,
type: cc.SpriteAtlas
},
btnPlay: {
default: null,
type: cc.Node
}
},
start: function() {},
init: function() {
for (var e = JSON.parse(i.skinList), t = JSON.parse(i.shopList), n = 0, a = 0; a < e.length; ++a) 1 == e[a] && n++;
if (n == e.length) return !1;
for (;;) {
var s = parseInt(9 * Math.random());
if (1 != e[t[s] - 1]) {
this.skinSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + t[s]);
this.index = s;
break;
}
}
this.btnPlay.stopAllActions();
this.btnPlay.scale = 1;
this.btnPlay.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.1), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.delayTime(2))));
return !0;
},
onBtnPlay: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.sdkHelper.showAd(2, function(e) {
if ("played" == e) {
var t = JSON.parse(i.skinList), n = JSON.parse(i.shopList);
t[n[this.index] - 1] = 1;
i.skinList = JSON.stringify(t);
cc.sys.localStorage.setItem("playerinfo_skinlist", i.skinList);
var a = i.useSkin;
i.useSkin = n[this.index];
cc.sys.localStorage.setItem("playerinfo_useskin", i.useSkin);
n[this.index] = a;
i.shopList = JSON.stringify(n);
cc.sys.localStorage.setItem("playerinfo_shoplist", i.shopList);
gameInstance.gameView.player.updateSkin();
gameInstance.startView.updateSkinNum();
gameInstance.gotSkinView.node.active = !0;
gameInstance.gotSkinView.init(n[this.index], 2);
this.node.active = !1;
}
}.bind(this));
},
onBtnClose: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
gameInstance.gameView.state = "running";
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo"
} ],
Boom: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "deb9bOzzatE8qBMnTv8nd6J", "Boom");
var i = e("../Utils/Utils");
cc.Class({
extends: cc.Component,
properties: {
boomPiecesArr: {
default: [],
type: [ cc.Node ]
},
type: {
default: 0
}
},
start: function() {
this.boom();
},
boom: function() {
if (0 == this.type) {
var e = .2 + .1 * Math.random();
this.node.runAction(cc.sequence(cc.delayTime(.7 * e), cc.fadeOut(.3 * e)));
for (var t = 0; t < this.boomPiecesArr.length; t++) {
var n = this.boomPiecesArr[t], a = i.getS2TAngle(0, n.x, 0, n.y, 1);
a += (Math.random() - .5) * Math.random() * 20;
var s = 50 * Math.random() + 80, c = n.x - Math.cos(i.getRad(a)) * s, o = n.y + Math.sin(i.getRad(a)) * s;
n.runAction(cc.spawn(cc.moveTo(e, cc.v2(c, o)).easing(cc.easeCircleActionOut()), cc.scaleTo(e, .1)));
}
} else {
var r = .3 + .2 * Math.random();
this.node.runAction(cc.sequence(cc.delayTime(.5 * r), cc.fadeOut(.5 * r)));
for (t = 0; t < this.boomPiecesArr.length; t++) {
n = this.boomPiecesArr[t];
var l = i.getS2TAngle(0, n.x, 0, n.y, 1);
l += (Math.random() - .5) * Math.random() * 20;
var d = 10 * Math.random() + 40, u = n.x - Math.cos(i.getRad(l)) * d, h = n.y + Math.sin(i.getRad(l)) * d;
n.runAction(cc.spawn(cc.moveTo(r, cc.v2(u, h)).easing(cc.easeCircleActionOut()), cc.moveBy(r, cc.v2(0, -200)).easing(cc.easeCubicActionIn()), cc.rotateBy(r, 2 * (Math.random() - .5) * (100 * Math.random() + 100)).easing(cc.easeCircleActionOut())));
}
}
}
});
cc._RF.pop();
}, {
"../Utils/Utils": "Utils"
} ],
GameManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "42330vAs2tN36X10DCs2905", "GameManager");
var i = e("../game/PlayerInfo"), a = function(e) {
return "" == e || null == e;
};
cc.Class({
extends: cc.Component,
properties: {
canvas: {
default: null,
type: cc.Canvas
},
levelesInfo: {
default: [],
visible: !1
},
soundManager: {
default: null,
type: e("SoundManager")
},
gameView: {
default: null,
type: e("GameView")
},
startView: {
default: null,
type: e("StartView")
},
pauseView: {
default: null,
type: e("PauseView")
},
adView: {
default: null,
type: e("AdView")
},
overView: {
default: null,
type: e("OverView")
},
shopView: {
default: null,
type: e("ShopView")
},
awardView: {
default: null,
type: e("AwardView")
},
gotSkinView: {
default: null,
type: e("GotSkinView")
},
rankView: {
default: null,
type: e("RankView")
},
isWeChat: {
default: !1,
visible: !1
},
sdkHelper: {
default: null,
type: e("SDKHelper")
}
},
onLoad: function() {
window.gameInstance = this;
cc.loader.loadRes("conf/levelesInfo", function(e, t) {
this.levelesInfo = t.json;
this.startView.init();
}.bind(this));
this.initPlayerInfo();
},
start: function() {},
initPlayerInfo: function() {
a(cc.sys.localStorage.getItem("playerinfo_gold")) && cc.sys.localStorage.setItem("playerinfo_gold", i.gold);
i.gold = parseInt(cc.sys.localStorage.getItem("playerinfo_gold"));
a(cc.sys.localStorage.getItem("playerinfo_highscore")) && cc.sys.localStorage.setItem("playerinfo_highscore", i.highScore);
i.highScore = parseInt(cc.sys.localStorage.getItem("playerinfo_highscore"));
a(cc.sys.localStorage.getItem("playerinfo_skinlist")) && cc.sys.localStorage.setItem("playerinfo_skinlist", i.skinList);
i.skinList = cc.sys.localStorage.getItem("playerinfo_skinlist");
a(cc.sys.localStorage.getItem("playerinfo_shoplist")) && cc.sys.localStorage.setItem("playerinfo_shoplist", i.shopList);
i.shopList = cc.sys.localStorage.getItem("playerinfo_shoplist");
a(cc.sys.localStorage.getItem("playerinfo_useskin")) && cc.sys.localStorage.setItem("playerinfo_useskin", i.useSkin);
i.useSkin = parseInt(cc.sys.localStorage.getItem("playerinfo_useskin"));
a(cc.sys.localStorage.getItem("playerinfo_issoundopen")) && cc.sys.localStorage.setItem("playerinfo_issoundopen", i.isSoundOpen);
i.isSoundOpen = cc.sys.localStorage.getItem("playerinfo_issoundopen");
a(cc.sys.localStorage.getItem("playerinfo_lastlevelindex")) && cc.sys.localStorage.setItem("playerinfo_lastlevelindex", i.lastLevelIndex);
i.lastLevelIndex = parseInt(cc.sys.localStorage.getItem("playerinfo_lastlevelindex"));
this.soundManager.setSoundOpen("true" == i.isSoundOpen);
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo",
AdView: "AdView",
AwardView: "AwardView",
GameView: "GameView",
GotSkinView: "GotSkinView",
OverView: "OverView",
PauseView: "PauseView",
RankView: "RankView",
SDKHelper: "SDKHelper",
ShopView: "ShopView",
SoundManager: "SoundManager",
StartView: "StartView"
} ],
GameView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "67b0cmvHhBOZZBpfaJXpLr8", "GameView");
var i = e("../Utils/Utils"), a = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
cloudies: {
default: [],
type: [ cc.Node ]
},
grasses1: {
default: [],
type: [ cc.Node ]
},
grasses2: {
default: [],
type: [ cc.Node ]
},
roads: {
default: [],
type: [ cc.Node ]
},
roadContents: {
default: [],
type: [ cc.Node ]
},
targets: {
default: [],
type: [ e("Target") ]
},
polyTargets: {
default: [],
type: [ e("PolyTargetNode") ]
},
polyLines: {
default: [],
type: [ cc.Node ]
},
polyStands: {
default: [],
type: [ cc.Node ]
},
targetsMask: {
default: [],
type: cc.Node
},
player: {
default: null,
type: e("Player")
},
goldLabel: {
default: null,
type: cc.Label
},
scoreLabel: {
default: null,
type: cc.Label
},
arrowLabel: {
default: null,
type: cc.Label
},
btnStart: {
default: null,
type: cc.Node
},
btnPause: {
default: null,
type: cc.Node
},
addArrow: {
default: null,
type: cc.Node
},
addTime: {
default: null,
type: cc.Node
},
addScores: {
default: [],
type: [ cc.Node ]
},
startPos: {
default: cc.v2(0, 0),
visible: !1
},
curIndex: {
default: 0,
visible: !1
},
abandonArrows: {
default: [],
visible: !1
},
modelType: {
default: 1,
visible: !1
},
score: {
default: 0,
visible: !1
},
levelIndex: {
default: 0,
visible: !1
},
curHitNum: {
default: 0,
visible: !1
},
state: {
default: "idle",
visible: !1
},
arrowNum: {
default: 14,
visible: !1
},
timeDown: {
default: 30,
visible: !1
},
levelBar: {
default: null,
type: e("LevelBar")
},
hand: {
default: null,
type: cc.Node
},
arrow: {
default: null,
type: cc.Node
},
ui_main: {
default: null,
type: cc.SpriteAtlas
},
clockIc: {
default: null,
type: cc.Node
},
arrowIc: {
default: null,
type: cc.Node
},
booms: {
default: [],
type: [ e("Boom") ]
},
particles: {
default: [],
type: [ cc.ParticleSystem ]
},
whiteFrame: {
default: null,
type: cc.SpriteFrame
},
lvProgress: {
default: null,
type: e("LvProgressBar")
},
firework: {
default: null,
type: cc.Node
},
fireworks: {
default: [],
visible: !1
},
ui_anim: {
default: null,
type: cc.SpriteAtlas
},
curLevelInfo: {
default: [],
visible: !1
},
reviveChance: {
default: 1,
visible: !1
},
goldIc: {
default: null,
type: cc.Node
},
addArrowNo: {
default: null,
type: cc.Node
},
addGoldNo: {
default: null,
type: cc.Node
},
startLevel: {
default: 0,
visible: !1
},
awarded: {
default: !1,
visible: !1
}
},
onLoad: function() {
var e = cc.view.getVisibleSize();
if ((e.height / e.width).toFixed(3) > (1334 / 750).toFixed(3)) {
var t = this.btnStart.parent.getComponent(cc.Widget);
t.top = 220;
t.updateAlignment();
}
this.infoTemp = [ {
parentNo: 1,
selfNo: 1,
hasBoss: "false",
pivotX: 0,
pivotY: 0,
polyType: 0
}, [ {
startX: 0,
startY: 0,
height: 450,
moveY: 100,
moveDir: 1,
speed: 1,
awardGold: 1,
awardArrow: 1,
awardTime: 2,
skinType: 1,
mustShoot: "true",
penetratable: "false",
movenable: "false"
} ] ], this.init();
},
start: function() {},
init: function() {
this.node.on(cc.Node.EventType.TOUCH_START, function(e) {
this.onMouseDown(e);
}, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
this.onMouseMove(e);
}, this);
this.node.on(cc.Node.EventType.TOUCH_END, function(e) {
this.onMouseUp(e);
}, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
this.onMouseUp(e);
}, this);
for (var e = 0; e < this.targetsMask.length; ++e) {
this.targetsMask[e].zIndex = this.targetsMask.length - e;
0 == e && (this.targetsMask[e].parent.parent.parent.zIndex = 2);
}
this.player.updateSkin();
this.updateGold();
},
initLevel: function() {
var e = this.genLevelInfo(), t = e[0], n = e[1];
if (0 == t.polyType) for (var i = 0; i < n.length; ++i) {
this.targets[3 * this.curIndex + i].node.active = !0;
this.targets[3 * this.curIndex + i].init(n[i], i);
} else {
for (var a = 0; a < n.length; ++a) {
this.polyTargets[10 * this.curIndex + a].node.active = !0;
this.polyTargets[10 * this.curIndex + a].init(n[a], a);
this.drawLine(t, n, a);
}
this.initStand(t);
}
},
initStand: function(e) {
var t = this.polyStands[this.curIndex];
t.x = e.pivotX;
t.height = e.pivotY - t.y;
t.active = !0;
},
drawLine: function(e, t, n) {
if (2 != e.polyType || n != t.length - 1) {
var a = t[n], s = n == t.length - 1 ? t[0] : t[n + 1], c = 25.74 + i.getDistance(a.startX, s.startX, a.startY, s.startY), o = gameInstance.gameView.polyLines[10 * this.curIndex + n];
o.active = !0;
o.position = cc.v2(a.startX, a.startY);
o.height = c;
o.anchorY = 12.87 / c;
o.rotation = i.getS2TAngle(a.startX, s.startX, a.startY, s.startY, 1) - 90;
}
},
getCurLevelInfo: function() {
return 0 == this.modelType ? gameInstance.levelesInfo[this.levelIndex > 59 ? this.randLevelIndex : this.levelIndex][0] : this.curLevelInfo[0];
},
getCurTargetsInfo: function() {
return 0 == this.modelType ? gameInstance.levelesInfo[this.levelIndex > 59 ? this.randLevelIndex : this.levelIndex][1] : this.curLevelInfo[1];
},
genLevelInfo: function() {
if (0 == this.modelType) {
var e = this.levelIndex;
if (e > 59) {
e = parseInt(60 * Math.random());
this.randLevelIndex = e;
}
return gameInstance.levelesInfo[e];
}
var t = this.infoTemp, n = t[0], i = t[1];
n.parentNo = parseInt(this.levelIndex / 5) + 1;
n.selfNo = this.levelIndex % 5 + 1;
this.curLevelInfo.push(n);
i[0].height = 500 * Math.random() + 250;
i[0].startX = 240 * (Math.random() - .5);
this.curLevelInfo.push(i);
return this.curLevelInfo;
},
getCurMustShoot: function() {
for (var e = 0, t = this.getCurTargetsInfo(), n = 0; n < t.length; ++n) "true" == t[n].mustShoot && e++;
return e;
},
update: function(e) {
for (var t = 0; t < this.cloudies.length; ++t) {
this.cloudies[t].position = cc.v2(this.cloudies[t].position.x - 1, 0);
this.cloudies[t].position.x < -this.node.width && (this.cloudies[t].position = cc.v2(this.node.width, 0));
}
},
startGame: function(e) {
this.modelType = e;
switch (e) {
case 0:
this.arrowNum = a.maxArrow;
this.updateArrow();
this.arrowIc.active = !0;
this.clockIc.active = !1;
break;

case 1:
this.timeDown = a.timeLimit;
this.arrowLabel.string = "" + this.timeDown;
this.schedule(this.timeLoop, 1);
gameInstance.soundManager.playClock();
this.arrowIc.active = !1;
this.clockIc.active = !0;
}
this.arrowLabel.node.parent.active = !0;
this.scoreLabel.node.active = !0;
this.btnPause.active = !0;
this.levelIndex = 0 == this.modelType ? 5 * parseInt(a.lastLevelIndex / 5) : 0;
for (var t = 0; t < 2; ++t) {
this.targets[3 * t].node.parent.x = 215 + 828 * t;
this.polyTargets[10 * t].node.parent.x = 215 + 828 * t;
}
this.initLevel(this.levelIndex);
this.lvProgress.init(this.levelIndex);
this.lvProgress.node.active = 0 == this.modelType;
this.playHand();
this.startLevel = this.levelIndex;
this.state = "running";
},
playHand: function() {
this.hand.stopAllActions();
this.arrow.stopAllActions();
this.hand.active = !0;
this.hand.position = cc.v2(110, 190);
this.hand.scale = 1.2;
this.hand.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1), cc.callFunc(function() {
this.arrow.active = !0;
this.arrow.rotation = 0;
this.arrow.scaleX = 0;
this.arrow.runAction(cc.scaleTo(.5, 1));
}.bind(this)), cc.moveBy(.5, cc.v2(-200, 0)), cc.delayTime(.3), cc.callFunc(function() {
this.arrow.runAction(cc.rotateTo(.5, -30).easing(cc.easeSineOut()));
}.bind(this)), cc.moveBy(.5, cc.v2(0, 200)).easing(cc.easeSineOut()), cc.callFunc(function() {
this.arrow.runAction(cc.rotateTo(.5, 30).easing(cc.easeSineInOut()));
}.bind(this)), cc.moveBy(1, cc.v2(0, -400)).easing(cc.easeSineInOut()), cc.delayTime(.3), cc.callFunc(function() {
this.arrow.runAction(cc.scaleTo(.2, 0, 1));
}.bind(this)), cc.scaleTo(.2, 1.2), cc.delayTime(1), cc.moveBy(.5, cc.v2(200, 200)))));
},
stopHand: function() {
this.hand.active = !1;
this.arrow.active = !1;
this.hand.stopAllActions();
this.arrow.stopAllActions();
},
timeLoop: function() {
if ("running" == this.state) {
this.timeDown--;
this.arrowLabel.string = "" + this.timeDown;
if (0 == this.timeDown) {
this.gameOver();
this.unschedule(this.timeLoop);
gameInstance.soundManager.stopClock();
}
}
},
gameOver: function() {
this.state = "over";
if (0 != this.reviveChance) {
this.reviveChance--;
gameInstance.adView.node.active = !0;
gameInstance.adView.init();
this.pauseTargets();
} else {
gameInstance.overView.node.active = !0;
gameInstance.overView.init();
}
},
revive: function() {
if (0 == this.modelType) {
this.arrowNum += 5;
this.updateArrow();
} else {
this.timeDown += 15;
this.arrowLabel.string = "" + this.timeDown;
this.schedule(this.timeLoop, 1);
gameInstance.soundManager.playClock();
}
this.state = "running";
this.resumeTargets();
},
pauseTargets: function() {
for (var e = 3 * this.curIndex; e < 3 * this.curIndex + 3; ++e) this.targets[e].pauseMove();
for (var t = 10 * this.curIndex; t < 10 * this.curIndex + 10; ++t) this.polyTargets[t].pauseMove();
},
resumeTargets: function() {
for (var e = 3 * this.curIndex; e < 3 * this.curIndex + 3; ++e) this.targets[e].resumeMove();
for (var t = 10 * this.curIndex; t < 10 * this.curIndex + 10; ++t) this.polyTargets[t].resumeMove();
},
onBtnStart: function() {
gameInstance.soundManager.playSound("btn");
this.state = "running";
gameInstance.pauseView.node.active = !1;
this.btnStart.active = !1;
this.btnPause.active = !0;
this.resumeTargets();
1 == this.modelType && gameInstance.soundManager.playClock();
},
onBtnPause: function() {
gameInstance.soundManager.playSound("btn");
if (this.player.shootEnable && !this.moving && !(1 == this.modelType && this.timeDown <= 1)) {
this.state = "pause";
gameInstance.pauseView.node.active = !0;
this.btnStart.active = !0;
this.btnPause.active = !1;
this.pauseTargets();
gameInstance.soundManager.stopClock();
}
},
onMouseDown: function(e) {
if ("running" == this.state) {
this.stopHand();
this.player.putArrow();
this.startPos = e.getLocation();
}
},
onMouseMove: function(e) {
if ("running" == this.state) {
var t = e.getLocation();
this.player.aim(this.startPos, t);
}
},
onMouseUp: function(e) {
if (!this.moving && "running" == this.state) {
var t = e.getLocation();
i.getDistance(t.x, this.startPos.x, t.y, this.startPos.y) < 1 || this.player.shoot();
}
},
updateLevelIndex: function() {
this.levelIndex++;
},
move: function() {
var e = this;
if (!this.moving) {
this.moving = !0;
this.player.jump();
for (var t = function(t) {
var n = e.grasses1[t];
n.runAction(cc.sequence(cc.moveBy(1, cc.v2(.2 * -e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
n.position.x < 10 - this.node.width && (n.position = cc.v2(this.node.width, 0));
this.moving = !1;
}.bind(e))));
}, n = 0; n < this.grasses1.length; ++n) t(n);
var i = function(t) {
var n = e.grasses2[t];
n.runAction(cc.sequence(cc.moveBy(1, cc.v2(.1 * -e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
n.position.x < 10 - this.node.width && (n.position = cc.v2(this.node.width, 0));
}.bind(e))));
};
for (n = 0; n < this.grasses2.length; ++n) i(n);
var s = function(t) {
var n = e.roads[t];
n.runAction(cc.sequence(cc.moveBy(1, cc.v2(-e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
n.position.x < 10 - this.node.width && (n.position = cc.v2(this.node.width, 0));
}.bind(e))));
};
for (n = 0; n < this.roads.length; ++n) s(n);
var c = function(t) {
var n = e.roadContents[t];
n.runAction(cc.sequence(cc.moveBy(1, cc.v2(-e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
if (n.position.x < 10 - this.node.width) {
n.position = cc.v2(this.node.width, 0);
this.player.clearArrows();
}
}.bind(e))));
};
for (n = 0; n < this.roadContents.length; ++n) c(n);
this.curHitNum = 0;
this.curIndex = 0 == this.curIndex ? 1 : 0;
this.updateLevelIndex();
if (0 == this.modelType) {
a.lastLevelIndex = this.levelIndex;
cc.sys.localStorage.setItem("playerinfo_lastlevelindex", a.lastLevelIndex);
}
if ("running" == this.state && !this.awarded && this.levelIndex >= this.startLevel + 10 && Math.random() < .33) {
var o = gameInstance.awardView.init();
gameInstance.awardView.node.active = o;
o && (this.state = "pause");
gameInstance.soundManager.stopClock();
this.awarded = !0;
}
this.initLevel(this.levelIndex);
this.lvProgress.updateProgress();
var r = function(t) {
var n = e.targets[3 * t].node.parent;
n.runAction(cc.sequence(cc.moveBy(1, cc.v2(-e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
if (n.position.x < 215 - this.node.width + 10) {
n.position = cc.v2(215 + this.node.width, n.position.y);
for (var e = 3 * t; e < 3 * t + 3; ++e) {
this.targets[e].node.active = !1;
this.targets[e].hit = !1;
this.targets[e].stopMove();
}
}
}.bind(e))));
var i = e.polyTargets[10 * t].node.parent;
i.runAction(cc.sequence(cc.moveBy(1, cc.v2(-e.node.width, 0)).easing(cc.easeQuadraticActionInOut(1.5)), cc.callFunc(function() {
if (i.position.x < 215 - this.node.width + 10) {
i.position = cc.v2(215 + this.node.width, i.position.y);
for (var e = 10 * t; e < 10 * t + 10; ++e) {
this.polyTargets[e].node.active = !1;
this.polyTargets[e].hit = !1;
this.polyTargets[e].stopMove();
this.polyLines[e].active = !1;
}
this.polyStands[t].active = !1;
}
}.bind(e))));
};
for (n = 0; n < 2; ++n) r(n);
}
},
addScore: function(e, t) {
var n = 0, i = null == t.head ? t.node : t.head;
if (30 == e) {
n = 2;
a.gold += t.awardGold;
cc.sys.localStorage.setItem("playerinfo_gold", a.gold);
this.updateGold();
this.addLife(t);
var s = cc.instantiate(this.goldIc), c = i.convertToWorldSpaceAR(cc.v2(-60, 160, 0));
s.position = cc.v2(c.x - this.node.width / 2, c.y - cc.view.getVisibleSize().height / 2 - 100);
s.parent = this.node;
s.active = !0;
s.runAction(cc.sequence(cc.delayTime(0), cc.spawn(cc.moveBy(.5, cc.v2(-100, 0)), cc.sequence(cc.moveBy(.2, cc.v2(0, 50)).easing(cc.easeQuadraticActionOut()), cc.moveBy(.3, cc.v2(0, -100)).easing(cc.easeQuadraticActionIn())), cc.fadeOut(.5))));
} else 20 == e && (n = 1);
var o = cc.instantiate(this.addScores[n]), r = i.convertToWorldSpaceAR(cc.v2(0, 0));
o.position = cc.v2(r.x - this.node.width / 2, r.y - cc.view.getVisibleSize().height / 2 - 100);
o.parent = this.node;
o.active = !0;
o.scale = 1.2;
o.runAction(cc.sequence(cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .88).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()), cc.delayTime(.2), cc.fadeOut(.5)));
this.score += e;
this.scoreLabel.string = "" + this.score;
if (this.score > a.highScore) {
a.highScore = this.score;
cc.sys.localStorage.setItem("playerinfo_highscore", a.highScore);
gameInstance.sdkHelper.uploadScore("" + this.score);
}
},
addLife: function(e) {
var t = cc.instantiate(0 == this.modelType ? this.addArrow : this.addTime);
t.position = this.addArrow.position;
t.parent = this.addArrow.parent;
t.active = !0;
t.scale = 1.2;
t.runAction(cc.sequence(cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .88).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()), cc.delayTime(.2), cc.fadeOut(.5)));
if (0 == this.modelType) {
this.arrowNum += e.awardArrow;
this.updateArrow();
} else {
this.timeDown += e.awardTime;
this.arrowLabel.string = "" + this.timeDown;
}
},
updateGold: function() {
this.goldLabel.string = "" + a.gold;
},
updateArrow: function() {
this.arrowLabel.string = "" + this.arrowNum;
},
resetTargets: function() {
for (var e = 0; e < this.targets.length; ++e) {
this.targets[e].node.active = !1;
this.targets[e].hit = !1;
this.targets[e].stopMove();
}
for (var t = 0; t < this.polyTargets.length; ++t) {
this.polyTargets[t].node.active = !1;
this.polyTargets[t].hit = !1;
this.polyTargets[t].stopMove();
}
},
reset: function() {
this.awarded = !1;
this.startLevel = 0;
this.curIndex = 0;
this.levelIndex = 0;
this.score = 0;
this.arrowNum = 14;
this.timeDown = 30;
this.reviveChance = 1;
this.curHitNum = 0;
this.scoreLabel.string = "0";
this.arrowLabel.node.parent.active = !1;
this.scoreLabel.node.active = !1;
this.btnStart.active = !1;
this.btnPause.active = !1;
this.curLevelInfo = [];
this.player.reset();
this.moving = !1;
this.lvProgress.reset();
this.lvProgress.node.active = !1;
this.resetTargets();
this.stopHand();
this.unschedule(this.timeLoop);
gameInstance.soundManager.stopClock();
this.targets[0].node.parent.position = cc.v2(215, this.targets[0].node.parent.position.y);
this.targets[3].node.parent.position = cc.v2(1043, this.targets[0].node.parent.position.y);
this.polyTargets[0].node.parent.position = cc.v2(215, this.polyTargets[0].node.parent.position.y);
this.polyTargets[10].node.parent.position = cc.v2(1043, this.polyTargets[0].node.parent.position.y);
},
showBoomFire: function() {
for (var e = 0; e < 30; e++) this.scheduleOnce(function() {
var e = this.getFirework();
e.position = cc.v2(424, cc.view.getVisibleSize().height / 2);
e.active = !0;
e.parent = this.node;
var t = 1080 * Math.random() - 540, n = .5 * Math.random() + .5;
Math.random();
e.runAction(cc.spawn(cc.moveTo(n, cc.v2(t, 1080 * Math.random() - 360)), cc.rotateTo(n, 90), cc.sequence(cc.delayTime(.7 * n), cc.fadeTo(.3 * n, 0))));
}.bind(this), .01 * e);
for (var t = 0; t < 30; t++) this.scheduleOnce(function() {
var e = this.getFirework();
e.position = cc.v2(-424, cc.view.getVisibleSize().height / 2);
e.active = !0;
e.parent = this.node;
var t = 1080 * Math.random() - 540, n = .5 * Math.random() + .5;
Math.random();
e.runAction(cc.spawn(cc.moveTo(n, cc.v2(t, 1080 * Math.random() - 360)), cc.rotateTo(n, 90), cc.sequence(cc.delayTime(.7 * n), cc.fadeTo(.3 * n, 0))));
}.bind(this), .01 * t);
},
showFirework: function() {
for (var e = 0; e < 5; e++) this.scheduleOnce(function() {
var e = this.getFirework();
e.active = !0;
e.parent = this.node;
e.position = cc.v2(1080 * Math.random() - 540, 40 * Math.random() + 900);
e.runAction(cc.sequence(cc.spawn(cc.rotateBy(3, 150), cc.moveTo(3, cc.v2(e.position.x, -1200))), cc.callFunc(function() {
e.active = !1;
e.parent = null;
this.fireworks.push(e);
}.bind(this))));
}.bind(this), .5 * e);
},
getFirework: function() {
if (this.fireworks.length <= 0) {
var e = cc.instantiate(this.firework);
e.zIndex = 10;
this.fireworks.push(e);
var t = parseInt(10 * Math.random() + 1);
this.firework.getComponent(cc.Sprite).spriteFrame = this.ui_anim.getSpriteFrame("ribbon" + (t + 1));
}
return this.fireworks.pop();
}
});
cc._RF.pop();
}, {
"../Utils/Utils": "Utils",
"../game/PlayerInfo": "PlayerInfo",
Boom: "Boom",
LevelBar: "LevelBar",
LvProgressBar: "LvProgressBar",
Player: "Player",
PolyTargetNode: "PolyTargetNode",
Target: "Target"
} ],
GotSkinView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e48a6DNx4lA0oAjPgde28YU", "GotSkinView");
e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
skinSpr: {
default: null,
type: cc.Sprite
},
ui_skin: {
default: null,
type: cc.SpriteAtlas
},
btnShare: {
default: null,
type: cc.Node
},
fromType: {
default: 1,
visible: !1
},
light: {
default: null,
type: cc.Node
}
},
start: function() {},
init: function(e, t) {
this.fromType = t;
this.skinSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + e);
this.btnShare.stopAllActions();
this.btnShare.scale = 1;
this.btnShare.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.5), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut(3)), cc.scaleTo(.1, 1.1).easing(cc.easeQuadraticActionIn(3)), cc.delayTime(1.5))));
gameInstance.sdkHelper.showAd(0);
this.light.stopAllActions();
this.light.runAction(cc.repeatForever(cc.rotateBy(5, 180)));
},
onBtnShare: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.sdkHelper.share();
},
onBtnClose: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
if (2 == this.fromType) {
gameInstance.gameView.state = "running";
gameInstance.soundManager.stopClock();
}
gameInstance.sdkHelper.showAd(0);
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo"
} ],
LevelBar: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a5127OztstDCJCc9fWWQB6E", "LevelBar");
cc.Class({
extends: cc.Component,
properties: {
boxes: {
default: [],
type: [ cc.Sprite ]
},
bosses: {
default: [],
type: [ cc.Node ]
},
bgs: {
default: [],
type: [ cc.Node ]
},
labeles: {
default: [],
type: [ cc.Label ]
}
},
start: function() {},
init: function() {
for (var e = 0; e < this.boxes.length; ++e) {
this.boxes[e].index = e;
if (e < 3) this.boxes[e].node.active = !1; else {
var t = gameInstance.levelesInfo[e - 3][0];
this.boxes[e].enabled = 3 == e;
this.bosses[e].active = "true" == t.hasBoss;
this.bgs[e].active = !0;
this.labeles[e].string = t.parentNo + "-" + t.selfNo;
}
}
},
move: function() {
for (var e = [ -255, -175, -95, 0, 95, 175 ], t = 0; t < this.boxes.length; ++t) {
var n = this.boxes[t], i = n.index;
if (--i < 0) {
i = 5;
n.node.x = 270;
n.node.active = !0;
var a = gameInstance.gameView.levelIndex, s = gameInstance.levelesInfo[a + 2][0];
this.bosses[t].active = "true" == s.hasBoss;
this.bgs[t].active = !0;
this.labeles[t].string = s.parentNo + "-" + s.selfNo;
n.node.runAction(cc.moveTo(.3, cc.v2(175, 0))).easing(cc.easeQuinticActionOut());
} else {
n.enabled = 3 == i;
n.node.runAction(cc.spawn(cc.moveTo(.3, cc.v2(e[i], 0)).easing(cc.easeQuinticActionOut()), cc.scaleTo(.2, 3 == i ? 1 : .75)));
}
n.index = i;
}
},
reset: function() {
for (var e = [ -255, -175, -95, 0, 95, 175 ], t = 0; t < this.boxes.length; ++t) {
this.boxes[t].node.x = e[t];
this.boxes[t].node.scale = 2 == t ? 1 : .75;
}
}
});
cc._RF.pop();
}, {} ],
LvProgressBar: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "69f20UWSvlHPZD58+ABARMi", "LvProgressBar");
cc.Class({
extends: cc.Component,
properties: {
items: {
default: [],
type: [ e("LvProgressItem") ]
},
curIndex: {
default: 0,
visible: !1
},
buleCircle: {
default: null,
type: cc.SpriteFrame
},
yelloCircle: {
default: null,
type: cc.SpriteFrame
},
buleRect: {
default: null,
type: cc.SpriteFrame
},
yelloRect: {
default: null,
type: cc.SpriteFrame
}
},
start: function() {},
init: function(e) {
for (var t = parseInt(e / 5), n = 0; n < 3; ++n) {
var i = this.items[n];
i.labeles[0].string = "" + (n + 1 + t);
i.node.zIndex = n;
this.items[n].node.getComponent(cc.Sprite).enabled = 0 == n;
}
},
updateProgress: function() {
var e = gameInstance.gameView.levelIndex % 5;
if (0 == e) {
this.items[this.curIndex].boxes[4].spriteFrame = this.yelloRect;
this.curIndex++;
this.curIndex > 2 && (this.curIndex = 0);
this.move();
} else {
var t = this.items[this.curIndex];
t.boxes[0].spriteFrame = this.yelloCircle;
for (var n = 1; n < e; ++n) t.boxes[n].spriteFrame = this.yelloRect;
}
},
move: function() {
for (var e = this, t = function(t) {
var n = e.items[t];
n.node.getComponent(cc.Sprite).enabled = !0;
n.node.runAction(cc.sequence(cc.moveBy(.5, cc.v2(-302, 0)).easing(cc.easeQuadraticActionOut()), cc.callFunc(function() {
if (n.node.x < -150) {
var e = gameInstance.gameView.levelIndex;
n.node.x = 604;
var i = parseInt(e / 5);
n.labeles[0].string = i + 3 + "";
n.boxes[0].spriteFrame = this.buleCircle;
n.node.zIndex = i + 2;
for (var a = 1; a < n.boxes.length; ++a) n.boxes[a].spriteFrame = this.buleRect;
}
n.node.getComponent(cc.Sprite).enabled = this.curIndex == t;
}.bind(e))));
}, n = 0; n < this.items.length; ++n) t(n);
},
reset: function() {
this.curIndex = 0;
for (var e = 0; e < this.items.length; ++e) {
var t = this.items[e];
t.node.x = 302 * e;
t.boxes[0].spriteFrame = this.buleCircle;
for (var n = 1; n < t.boxes.length; ++n) t.boxes[n].spriteFrame = this.buleRect;
}
}
});
cc._RF.pop();
}, {
LvProgressItem: "LvProgressItem"
} ],
LvProgressItem: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6a1a6A2uidMdaDAC8vXJWj5", "LvProgressItem");
cc.Class({
extends: cc.Component,
properties: {
boxes: {
default: [],
type: [ cc.Sprite ]
},
labeles: {
default: [],
type: [ cc.Label ]
}
},
start: function() {}
});
cc._RF.pop();
}, {} ],
OverView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "007a3FnWIBLo7RmarIVmmQQ", "OverView");
var i = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
scoreLabel: {
default: null,
type: cc.Label
},
higScoreLabel: {
default: null,
type: cc.Label
},
noArrow: {
default: null,
type: cc.Node
},
noTime: {
default: null,
type: cc.Node
}
},
start: function() {},
init: function() {
this.scoreLabel.string = "" + gameInstance.gameView.score;
this.higScoreLabel.string = "" + i.highScore;
if (0 == gameInstance.gameView.modelType) {
this.noArrow.active = !0;
this.noTime.active = !1;
} else if (1 == gameInstance.gameView.modelType) {
this.noArrow.active = !1;
this.noTime.active = !0;
}
var e = 0 == gameInstance.gameView.modelType ? this.noArrow : this.noTime;
e.stopAllActions();
e.runAction(cc.sequence(cc.scaleTo(.1, .9).easing(cc.easeSineOut()), cc.callFunc(function() {
e.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.2, 1.1).easing(cc.easeSineInOut()), cc.scaleTo(.2, .9).easing(cc.easeSineInOut()))));
}.bind(this))));
gameInstance.sdkHelper.showAd(0);
},
onBtnHome: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
gameInstance.gameView.reset();
gameInstance.startView.node.active = !0;
gameInstance.startView.init();
gameInstance.sdkHelper.showAd(0);
},
onBtnShare: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.sdkHelper.share();
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo"
} ],
PauseView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d30cbqZruBNJaf9IIhlPrVg", "PauseView");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
onBtnContinue: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.gameView.onBtnStart();
},
onBtnReturn: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
gameInstance.gameView.reset();
gameInstance.startView.node.active = !0;
gameInstance.startView.init();
}
});
cc._RF.pop();
}, {} ],
PlayerInfo: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4a5aaMomA9JFqfk1AGUGcTu", "PlayerInfo");
var i = {
gold: 0,
highScore: 0,
skinList: "[1,0,0,0,0,0,0,0,0,0]",
shopList: "[2,3,4,5,6,7,8,9,10]",
useSkin: 1,
maxArrow: 5,
timeLimit: 30,
isSoundOpen: "true",
lastLevelIndex: 0
};
t.exports = i;
cc._RF.pop();
}, {} ],
Player: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "1a0c3G7FSdBLaykdQ8FbyN2", "Player");
var i = e("../utils/Utils"), a = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
body: {
default: null,
type: cc.Sprite
},
arm1: {
default: null,
type: cc.Sprite
},
arm2: {
default: null,
type: cc.Sprite
},
arm3: {
default: null,
type: cc.Sprite
},
bow: {
default: null,
type: cc.Node
},
bowStrings: {
default: [],
type: [ cc.Node ]
},
bowHeads: {
default: [],
type: [ cc.Node ]
},
hand: {
default: null,
type: cc.Node
},
arrow: {
default: null,
type: cc.Node
},
curArrow: {
default: null,
visible: !1
},
arrows: {
default: [],
visible: !1
},
rounds: {
default: [],
type: [ cc.Node ]
},
shootEnable: {
default: !0,
visible: !1
},
ui_skin: {
default: null,
type: cc.SpriteAtlas
},
shadow: {
default: null,
type: cc.Node
},
speedMutl: {
default: 100,
visible: !1
}
},
start: function() {},
update: function(e) {},
updateSkin: function() {
var e = [ 1, 2, 2, 4, 4, 1, 2, 2, 5, 3 ];
this.body.spriteFrame = this.ui_skin.getSpriteFrame("game_p" + a.useSkin);
this.arm3.spriteFrame = this.ui_skin.getSpriteFrame("game_arm_under" + e[a.useSkin - 1]);
this.arm2.spriteFrame = this.ui_skin.getSpriteFrame("game_arm_on" + e[a.useSkin - 1]);
},
putArrow: function() {
if (null == this.curArrow || null == this.curArrow.node.parent || "arm2" != this.curArrow.node.parent.name) {
var e = cc.instantiate(this.arrow);
e.parent = this.arrow.parent;
e.position = this.arrow.position;
e.active = !0;
e.zIndex = -1;
this.curArrow = e.getComponent("Arrow");
}
},
aim: function(e, t) {
this.force = Math.min(Math.abs(t.x - e.x) / 106, 1);
var n = i.getS2TAngle(e.x, t.x, e.y, t.y, 1);
n > 30 && n < 165 ? n = 30 : n < 300 && n > 165 && (n = 300);
n >= 300 ? this.angle = 360 - n : n <= 30 && (this.angle = -n);
this.arm1.node.parent.rotation = n;
this.arm3.node.parent.rotation = n;
this.arm2.node.x = 40 * -this.force;
this.rounds[0].parent.active = !0;
this.rounds[0].parent.position = cc.v2(70 + 30 * this.force, this.rounds[0].parent.position.y);
for (var a = 0; a < this.rounds.length; ++a) {
var s = this.rounds[a].parent.convertToWorldSpaceAR(cc.v2(0, 0)).x + 30 * a, c = (s - this.arrow.convertToWorldSpaceAR(cc.v2(0, 0)).x) / (60 * this.force * this.speedMutl * Math.cos(i.getRad(this.angle))), o = this.arrow.convertToWorldSpaceAR(cc.v2(0, 0)).y + 60 * this.force * this.speedMutl * c * Math.sin(i.getRad(this.angle)) - 25 * c * c * 100;
this.rounds[a].position = this.rounds[a].parent.convertToNodeSpaceAR(cc.v2(s, o));
}
for (var r = this.hand.convertToWorldSpaceAR(cc.v2(0, 0)), l = 0; l < 2; ++l) {
var d = this.bowHeads[l].convertToWorldSpaceAR(cc.v2(0, 0));
this.bowStrings[l].position = this.bow.convertToNodeSpaceAR(r);
this.bowStrings[l].rotation = i.getS2TAngle(r.x, d.x, r.y, d.y, 1) - 90 - this.arm1.node.parent.rotation + 180 * l;
this.bowStrings[l].scaleY = i.getDistance(r.x, d.x, r.y, d.y) / this.bowStrings[l].height;
}
},
shoot: function() {
this.rounds[0].parent.active = !1;
if (null != this.curArrow.node.parent && this.curArrow.node.parent.name == this.arrow.parent.name && this.shootEnable) {
this.shootEnable = !1;
gameInstance.soundManager.playSound("shoot");
var e = this.curArrow.node.convertToWorldSpaceAR(cc.v2(0, 0));
this.curArrow.node.parent = this.node.parent;
this.curArrow.node.position = cc.v2(e.x - gameInstance.canvas.node.width / 2, e.y - cc.view.getVisibleSize().height / 2);
this.curArrow.node.rotation = this.arm1.node.parent.rotation;
this.curArrow.node.zIndex = 1;
this.curArrow.shoot(this.angle, this.force * this.speedMutl);
this.resetArm();
this.arrows.push(this.curArrow);
this.arm2.node.x = -8;
if (0 == gameInstance.gameView.modelType) {
gameInstance.gameView.arrowNum--;
gameInstance.gameView.updateArrow();
}
}
},
jump: function() {
this.node.runAction(cc.spawn(cc.sequence(cc.callFunc(function() {
gameInstance.soundManager.playSound("walk1");
}.bind(this)), cc.moveBy(.1, cc.v2(0, 40)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -40)).easing(cc.easeSineIn()), cc.callFunc(function() {
gameInstance.soundManager.playSound("walk1");
}.bind(this)), cc.moveBy(.1, cc.v2(0, 30)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -30)).easing(cc.easeSineIn()), cc.callFunc(function() {
gameInstance.soundManager.playSound("walk1");
}.bind(this)), cc.moveBy(.1, cc.v2(0, 20)).easing(cc.easeSineOut()), cc.moveBy(.1, cc.v2(0, -20)).easing(cc.easeSineIn())), cc.sequence(cc.moveBy(.6, cc.v2(200, 0)).easing(cc.easeQuadraticActionOut()), cc.moveBy(.4, cc.v2(-200, 0)).easing(cc.easeQuadraticActionOut()))));
this.shadow.runAction(cc.sequence(cc.scaleTo(.1, .7).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn()), cc.scaleTo(.1, .8).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn()), cc.scaleTo(.1, .9).easing(cc.easeSineOut()), cc.scaleTo(.1, 1).easing(cc.easeSineIn())));
},
clearArrows: function() {
for (var e = 0; e < this.arrows.length; ++e) this.arrows[e].clearSelf();
this.arrows = [];
},
resetArm: function() {
this.angle = 0;
this.force = 0;
for (var e = 0; e < 2; ++e) {
this.bowStrings[e].position = cc.v2(-20, 0);
this.bowStrings[e].rotation = 0;
this.bowStrings[e].scaleY = 1;
}
},
reset: function() {
this.clearArrows();
null != this.curArrow && (this.curArrow.node.parent = null);
this.resetArm();
this.arm1.node.parent.rotation = 0;
this.arm2.node.x = 0;
this.arm3.node.parent.rotation = 0;
this.rounds[0].parent.active = !1;
this.shootEnable = !0;
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo",
"../utils/Utils": "Utils"
} ],
PolyTargetNode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "8cbd7NXgWBCdKZBizJJoZjk", "PolyTargetNode");
e("../Utils/Utils");
cc.Class({
extends: cc.Component,
properties: {
length: {
default: 450,
visible: !1
},
index: {
default: 0,
visible: !1
},
skinName: {
default: [],
visible: !1
}
},
onLoad: function() {
this.skinName = [ "target1", "target_balloon", "target_glass", "target_wood" ];
},
start: function() {},
init: function(e, t) {
this.node.position = cc.v2(cc.v2(e.startX, e.startY));
this.speed = e.speed;
this.penetratable = e.penetratable;
this.awardGold = e.awardGold;
this.awardArrow = e.awardArrow;
this.awardTime = e.awardTime;
this.skinType = e.skinType;
this.mustShoot = e.mustShoot;
this.index = t;
this.node.zIndex = 10 - t;
this.node.opacity = 255;
this.updateSkin();
this.move();
},
updateSkin: function() {
var e = gameInstance.gameView.ui_main.getSpriteFrame(this.skinName[this.skinType - 1]);
this.node.getComponent(cc.Sprite).spriteFrame = e;
this.node.width = e._rect.width;
this.node.height = e._rect.height;
},
explode: function() {
if (1 != this.skinType) {
this.node.active = !1;
var e = gameInstance.gameView, t = cc.instantiate(e.booms[this.skinType - 2].node);
t.parent = this.node.parent;
t.position = this.node.position;
t.active = !0;
if (2 == this.skinType) {
gameInstance.soundManager.playSound("ballon");
var n = this.node.convertToWorldSpaceAR(cc.v2(0, 0)), i = Math.random() > .5, a = cc.instantiate(i ? e.addArrowNo : e.addGoldNo);
a.parent = e.node;
a.position = e.node.convertToNodeSpaceAR(n);
a.active = !0;
a.scale = 1.2;
a.runAction(cc.sequence(cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .88).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()), cc.delayTime(.2), cc.fadeOut(.5)));
if (i) {
a.getChildByName("label").getComponent(cc.Label).string = "" + this.awardArrow;
gameInstance.gameView.arrowNum += this.awardArrow;
gameInstance.gameView.updateArrow();
} else {
a.getChildByName("label").getComponent(cc.Label).string = "" + this.awardGold;
playerInfo.gold += this.awardGold;
cc.sys.localStorage.setItem("playerinfo_gold", playerInfo.gold);
gameInstance.gameView.updateGold();
}
} else 3 == this.skinType && gameInstance.soundManager.playSound("glass");
}
},
playPart: function(e) {
var t = cc.instantiate(gameInstance.gameView.particles[e].node);
t.parent = this.node.parent;
t.position = this.node.position;
t.active = !0;
},
move: function() {
this.moving = !0;
this.node.stopAllActions();
var e = gameInstance.gameView.getCurLevelInfo(), t = gameInstance.gameView.getCurTargetsInfo();
if (this.index == t.length - 1) {
this.index = 0;
var n = t[this.index];
if (void 0 == n) return;
2 != e.polyType ? this.node.runAction(cc.sequence(cc.moveTo(1 / this.speed, cc.v2(n.startX, n.startY)), cc.callFunc(function() {
this.move();
}.bind(this)))) : this.node.runAction(cc.sequence(cc.fadeOut(1 / this.speed / 4), cc.delayTime(1 / this.speed / 2), cc.moveTo(0, cc.v2(n.startX, n.startY)), cc.fadeIn(1 / this.speed / 4), cc.callFunc(function() {
this.move();
}.bind(this))));
} else {
this.index++;
var i = t[this.index];
if (void 0 == i) return;
this.node.runAction(cc.sequence(cc.moveTo(1 / this.speed, cc.v2(i.startX, i.startY)), cc.callFunc(function() {
this.move();
}.bind(this))));
}
},
stopMove: function() {
this.moving = !1;
this.node.stopAllActions();
},
pauseMove: function() {
this.node.pauseAllActions();
},
resumeMove: function() {
this.node.resumeAllActions();
}
});
cc._RF.pop();
}, {
"../Utils/Utils": "Utils"
} ],
RankView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6a3c4ArTuhCEobbvyH1/95U", "RankView");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {},
init: function() {
gameInstance.gameView.goldLabel.node.parent.active = !1;
gameInstance.sdkHelper.showRank();
},
onBtnChallenge: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.gameView.goldLabel.node.parent.active = !1;
gameInstance.sdkHelper.share();
},
onBtnClose: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
gameInstance.startView.node.active = !0;
gameInstance.gameView.goldLabel.node.parent.active = !0;
}
});
cc._RF.pop();
}, {} ],
SDKHelper: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0c6c3ppto9PPL3ERga8jlq0", "SDKHelper");
cc.Class({
extends: cc.Component,
properties: {
adCallback: {
default: null,
visible: !1
}
},
onLoad: function() {},
start: function() {
this.onShare();
},
onShare: function(e, t, n, i) {
if (gameInstance.isWeChat) {
wx.showShareMenu({
withShareTicket: !0
});
wx.onShareAppMessage(function() {
return {
title: e,
imageUrl: t || canvas.toTempFilePathSync({
destWith: 500,
destHeight: 400
}),
query: n,
imageUrlId: i,
success: function() {
console.log("分享成功");
},
complete: function() {
console.log("分享失败");
}
};
});
}
},
uploadScore: function(e) {
gameInstance.isWeChat && wx.setUserCloudStorage({
KVDataList: [ {
key: "score",
value: e
} ],
success: function(e) {
console.log(e);
},
complete: function(e) {
console.log(e);
}
});
},
showRank: function() {
gameInstance.isWeChat && wx.getOpenDataContext().postMessage({
msg: "display"
});
},
share: function(e, t, n, i) {
gameInstance.isWeChat ? wx.shareAppMessage({
title: e,
imageUrl: t || canvas.toTempFilePathSync({
destWith: 500,
destHeight: 400
}),
query: n,
imageUrlId: i,
success: function() {
console.log("分享成功");
},
complete: function() {
console.log("分享失败");
}
}) : cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(I)V", type) : cc.sys.isNative && (cc.sys.os, 
cc.sys.OS_IOS);
},
showAd: function(e, t) {
this.adCallback = t;
gameInstance.isWeChat || (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAd", "(I)V", e) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS || this.onAdCallback("played"));
},
onAdCallback: function(e) {
console.log("onAdCallback, status: " + e);
null != this.adCallback && this.adCallback(e);
this.adCallback = null;
}
});
cc._RF.pop();
}, {} ],
ShopItem: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0987d5S441APYPQl6xwNzQR", "ShopItem");
cc.Class({
extends: cc.Component,
properties: {
selfSpr: {
default: null,
type: cc.Sprite
},
skinNo: {
default: 1,
visible: !1
}
},
start: function() {}
});
cc._RF.pop();
}, {} ],
ShopView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "97d05J8ah1P1rpTZXnsI3MN", "ShopView");
var i = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
items: {
default: [],
type: [ e("ShopItem") ]
},
curSpr: {
default: null,
type: cc.Sprite
},
ui_skin: {
default: null,
type: cc.SpriteAtlas
},
goldLabel: {
default: null,
type: cc.Label
}
},
start: function() {
var e = cc.view.getVisibleSize();
if ((e.height / e.width).toFixed(3) > (1334 / 750).toFixed(3)) {
var t = this.goldLabel.node.parent.parent.getComponent(cc.Widget);
t.top = 225;
t.updateAlignment();
}
},
init: function() {
for (var e = JSON.parse(i.skinList), t = JSON.parse(i.shopList), n = 0; n < this.items.length; ++n) {
var a = this.items[n];
a.selfSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + t[n]);
a.skinNo = t[n];
a.selfSpr.node.color = 1 == e[t[n] - 1] ? cc.color(255, 255, 255) : cc.color(0, 0, 0);
}
this.curSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + i.useSkin);
this.goldLabel.string = i.gold + "";
},
onClickItem: function(e, t) {
gameInstance.soundManager.playSound("btn");
var n = JSON.parse(i.skinList), a = JSON.parse(i.shopList), s = JSON.parse(t), c = i.useSkin;
if (0 != n[a[s] - 1]) {
i.useSkin = this.items[s].skinNo;
a[s] = c;
i.shopList = JSON.stringify(a);
this.items[s].skinNo = c;
this.items[s].selfSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + c);
this.curSpr.spriteFrame = this.ui_skin.getSpriteFrame("skin_p" + i.useSkin);
gameInstance.gameView.player.updateSkin();
cc.sys.localStorage.setItem("playerinfo_useskin", i.useSkin);
cc.sys.localStorage.setItem("playerinfo_shoplist", i.shopList);
}
},
onBtnUnlock: function() {
gameInstance.soundManager.playSound("btn");
if (!(i.gold < 30)) {
for (var e = JSON.parse(i.skinList), t = JSON.parse(i.shopList), n = 0, a = 0; a < e.length; ++a) 1 == e[a] && n++;
if (n != e.length) {
var s = Math.max(.3 * (10 - n) / 9, .2), c = -1, o = function() {
var a = this, r = function() {
var r = parseInt(9 * Math.random());
if (1 == e[t[r] - 1] || n < 9 && r == c) return "continue";
a.items[r].selfSpr.node.scale = 1;
a.items[r].selfSpr.node.stopAllActions();
a.items[r].selfSpr.node.runAction(cc.sequence(cc.scaleTo(.1, 1.2).easing(cc.easeQuadraticActionOut()), cc.scaleTo(.1, 1).easing(cc.easeQuadraticActionIn())));
if (9 == n || s < .15) {
e[t[r] - 1] = 1;
a.items[r].selfSpr.node.color = cc.color(255, 255, 255);
i.skinList = JSON.stringify(e);
cc.sys.localStorage.setItem("playerinfo_skinlist", i.skinList);
i.gold -= 30;
cc.sys.localStorage.setItem("playerinfo_gold", i.gold);
gameInstance.startView.updateSkinNum();
gameInstance.gameView.updateGold();
a.goldLabel.string = "" + i.gold;
setTimeout(function() {
gameInstance.gotSkinView.node.active = !0;
gameInstance.gotSkinView.init(t[r], 1);
}, .2);
return "break";
}
setTimeout(o, 1e3 * s);
s -= .01;
c = r;
return "break";
};
e: for (;;) {
switch (r()) {
case "continue":
continue;

case "break":
break e;
}
}
}.bind(this);
o();
}
}
},
onBtnPlayAd: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.sdkHelper.showAd(2, function(e) {
if ("played" == e) {
i.gold += 10;
cc.sys.localStorage.setItem("playerinfo_gold", i.gold);
gameInstance.gameView.updateGold();
this.goldLabel.string = i.gold + "";
}
}.bind(this));
},
onBtnExit: function() {
gameInstance.soundManager.playSound("btn");
this.node.active = !1;
Math.random() < .3 && gameInstance.sdkHelper.showAd(1);
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo",
ShopItem: "ShopItem"
} ],
SoundManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "83d57LzIiVAao5GgNvMSOoV", "SoundManager");
cc.Class({
extends: cc.Component,
properties: {
isSoundOpen: {
default: !0,
visible: !1
},
audioSource: {
type: cc.AudioSource,
default: null
},
bgm1: {
type: cc.AudioClip,
default: null
},
bgm2: {
type: cc.AudioClip,
default: null
},
btn: {
type: cc.AudioClip,
default: null
},
clock: {
type: cc.AudioClip,
default: null
},
hit1: {
type: cc.AudioClip,
default: null
},
hit2: {
type: cc.AudioClip,
default: null
},
shoot: {
type: cc.AudioClip,
default: null
},
walk1: {
type: cc.AudioClip,
default: null
},
walk2: {
type: cc.AudioClip,
default: null
},
ballon: {
type: cc.AudioClip,
default: null
},
glass: {
type: cc.AudioClip,
default: null
},
clockId: {
default: -1,
visible: !1
}
},
start: function() {},
playBg: function() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
this.audioSource.clip = this["bgm" + e];
this.audioSource.loop = !0;
this.isSoundOpen && this.audioSource.play();
},
playSound: function(e) {
this.isSoundOpen && cc.audioEngine.playEffect(this[e], !1);
},
playClock: function() {
if (this.isSoundOpen) {
var e = function() {
var e = cc.audioEngine.playEffect(this.clock, !1);
this.clockId = e;
}.bind(this);
e();
this.schedule(e, 4.056);
}
},
stopClock: function() {
-1 != this.clockId && cc.audioEngine.stopEffect(this.clockId);
this.unscheduleAllCallbacks();
},
setSoundOpen: function(e) {
this.isSoundOpen = e;
cc.sys.localStorage.setItem("playerinfo_issoundopen", e ? "true" : "false");
e ? this.playBg() : this.audioSource.stop();
}
});
cc._RF.pop();
}, {} ],
StartView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e13c5W3gOlGAKwaRAPnD4jp", "StartView");
var i = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
skinLabel: {
default: null,
type: cc.Label
},
settingContent: {
default: null,
type: cc.Node
},
settingOpen: {
default: !1,
visible: !1
},
btnSoundClose: {
default: null,
type: cc.Node
},
btnSoundOpen: {
default: null,
type: cc.Node
}
},
start: function() {
var e = cc.view.getVisibleSize();
if ((e.height / e.width).toFixed(3) > (1334 / 750).toFixed(3)) {
var t = this.settingContent.parent.parent.getComponent(cc.Widget);
t.top = 210;
t.updateAlignment();
}
},
init: function() {
this.updateSkinNum();
this.updateSoundBtn();
},
updateSkinNum: function() {
for (var e = JSON.parse(i.skinList), t = 0, n = 0; n < e.length; ++n) 1 == e[n] && t++;
this.skinLabel.string = t + "/10";
},
onBtnSetting: function() {
gameInstance.soundManager.playSound("btn");
this.settingOpen || (this.settingContent.active = !0);
this.settingContent.stopAllActions();
this.settingContent.runAction(cc.sequence(cc.moveTo(.3, cc.v2(0, this.settingOpen ? 200 : 0)).easing(cc.easeQuadraticActionOut()), cc.callFunc(function() {
this.settingOpen = !this.settingOpen;
this.settingOpen || (this.settingContent.active = !1);
}.bind(this))));
},
onBtnSound: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.soundManager.setSoundOpen(!gameInstance.soundManager.isSoundOpen);
this.updateSoundBtn();
},
updateSoundBtn: function() {
this.btnSoundClose.active = gameInstance.soundManager.isSoundOpen;
this.btnSoundOpen.active = !gameInstance.soundManager.isSoundOpen;
},
onBtnLock: function() {
gameInstance.soundManager.playSound("btn");
},
onBtnStart: function(e, t) {
var n = JSON.parse(t);
if (!(n > 1)) {
gameInstance.soundManager.playSound("btn");
gameInstance.gameView.startGame(n);
this.node.active = !1;
}
},
onBtnShop: function() {
gameInstance.soundManager.playSound("btn");
gameInstance.shopView.node.active = !0;
gameInstance.shopView.init();
},
onBtnRank: function() {
gameInstance.soundManager.playSound("btn");
this.onRankCallback();
},
onRankCallback: function() {
this.node.active = !1;
gameInstance.rankView.node.active = !0;
gameInstance.rankView.init();
}
});
cc._RF.pop();
}, {
"../game/PlayerInfo": "PlayerInfo"
} ],
Target: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "eea4a9sG95N+KQMZSKL0sWP", "Target");
e("../Utils/Utils");
var i = e("../game/PlayerInfo");
cc.Class({
extends: cc.Component,
properties: {
head: {
default: null,
type: cc.Node
},
body: {
default: null,
type: cc.Node
},
body1: {
default: null,
type: cc.Node
},
bottom: {
default: null,
type: cc.Node
},
hit: {
default: !1,
visible: !1
},
speed: {
default: 1,
visible: !1
},
skinName: {
default: [],
visible: !1
},
bodyFrame: {
default: null,
visible: !1
}
},
onLoad: function() {
this.skinName = [ "target1", "target_balloon", "target_glass", "target_wood" ];
this.bodyFrame = this.body.getComponent(cc.Sprite).spriteFrame;
},
start: function() {},
init: function(e, t) {
this.body.height = e.height;
this.body.scale = 1;
this.index = t;
this.moveY = e.moveY;
this.moveDir = e.moveDir;
this.speed = e.speed;
this.penetratable = e.penetratable;
this.awardGold = e.awardGold;
this.awardArrow = e.awardArrow;
this.awardTime = e.awardTime;
this.skinType = e.skinType;
this.mustShoot = e.mustShoot;
this.updateSkin();
this.setHeadPos();
this.node.position = cc.v2(e.startX, this.node.position.y);
this.body.parent.rotation = 0;
this.node.zIndex = 6 - t;
this.head.active = !0;
this.body.active = !0;
this.bottom.active = !0;
"true" == e.movenable && this.move();
},
updateSkin: function() {
var e = gameInstance.gameView.ui_main.getSpriteFrame(this.skinName[this.skinType - 1]);
this.head.getComponent(cc.Sprite).spriteFrame = e;
this.head.width = e._rect.width;
this.head.height = e._rect.height;
if (2 == this.skinType) {
this.body.getComponent(cc.Sprite).spriteFrame = gameInstance.gameView.whiteFrame;
this.body.width = 2;
this.body1.active = !1;
} else {
this.body.getComponent(cc.Sprite).spriteFrame = this.bodyFrame;
this.body.width = this.bodyFrame._rect.width;
this.body1.active = !0;
}
},
explode: function() {
if (1 != this.skinType) {
this.head.active = !1;
var e = gameInstance.gameView, t = cc.instantiate(e.booms[this.skinType - 2].node);
t.parent = this.head.parent;
t.position = this.head.position;
t.active = !0;
if (2 == this.skinType) {
gameInstance.soundManager.playSound("ballon");
this.body.active = !1;
this.bottom.active = !1;
var n = this.head.convertToWorldSpaceAR(cc.v2(0, 0)), a = Math.random() > .5, s = cc.instantiate(a ? e.addArrowNo : e.addGoldNo);
s.parent = e.node;
s.position = e.node.convertToNodeSpaceAR(n);
s.active = !0;
s.scale = 1.2;
s.runAction(cc.sequence(cc.scaleTo(.15, .8).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.12).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .88).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1.05).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, .95).easing(cc.easeQuadraticActionInOut()), cc.scaleTo(.15, 1).easing(cc.easeQuadraticActionIn()), cc.delayTime(.2), cc.fadeOut(.5)));
if (a) {
s.getChildByName("label").getComponent(cc.Label).string = "" + this.awardArrow;
gameInstance.gameView.arrowNum += this.awardArrow;
gameInstance.gameView.updateArrow();
} else {
s.getChildByName("label").getComponent(cc.Label).string = "" + this.awardGold;
i.gold += this.awardGold;
cc.sys.localStorage.setItem("playerinfo_gold", i.gold);
gameInstance.gameView.updateGold();
}
} else 3 == this.skinType && gameInstance.soundManager.playSound("glass");
}
},
playPart: function(e) {
var t = cc.instantiate(gameInstance.gameView.particles[e].node);
t.parent = this.head.parent;
t.position = this.head.position;
t.active = !0;
},
move: function() {
this.moving = !0;
this.body.stopAllActions();
var e = this.moveY / this.body.height;
this.body.runAction(cc.sequence(cc.scaleTo(1 / this.speed, 1, 1 + this.moveDir * e).easing(cc.easeSineOut()), cc.callFunc(function() {
this.body.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(2 / this.speed, 1, 1 - this.moveDir * e).easing(cc.easeSineInOut()), cc.scaleTo(2 / this.speed, 1, 1 + this.moveDir * e).easing(cc.easeSineInOut()))));
}.bind(this))));
},
pauseMove: function() {
this.body.pauseAllActions();
},
resumeMove: function() {
this.body.resumeAllActions();
},
stopMove: function() {
this.moving = !1;
this.body.stopAllActions();
},
update: function() {
this.moving && this.setHeadPos();
this.rocking || this.moving;
},
updateMask: function() {
var e = this.head.convertToWorldSpaceAR(cc.v2(0, 0)), t = gameInstance.gameView.targetsMask[this.index];
t.position = t.parent.convertToNodeSpaceAR(e);
t.active = !0;
},
setHeadPos: function() {
this.head.position = cc.v2(this.head.position.x, this.body.height * this.body.scaleY);
this.body1.position = cc.v2(this.body1.position.x, this.head.position.y - this.head.height / 2);
},
rock: function() {
this.rocking = !0;
this.body.parent.runAction(cc.sequence(cc.rotateBy(.2, -2).easing(cc.easeSineOut()), cc.rotateBy(.2, 3.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, -2.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, 1.5).easing(cc.easeSineInOut()), cc.rotateBy(.2, -.5).easing(cc.easeSineIn()), cc.callFunc(function() {
this.rocking = !1;
}.bind(this))));
}
});
cc._RF.pop();
}, {
"../Utils/Utils": "Utils",
"../game/PlayerInfo": "PlayerInfo"
} ],
Utils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "63a7dmbHu5M3rhwIeedLmt0", "Utils");
var i = {
getRad: function(e) {
return e / 360 * Math.PI * 2;
},
getDeg: function(e) {
return e / (2 * Math.PI) * 360;
},
getS2TAngle: function(e, t, n, i, a) {
var s = 360 * Math.atan((n - i) / (e - t)) / (2 * Math.PI), c = 0;
e > t && n > i ? c = s : e < t && n != i ? c = 180 + s : e > t && n < i ? c = 360 + s : e > t && n == i ? c = 0 : e == t && n > i ? c = 90 : e < t && n == i ? c = 180 : e == t && n < i ? c = 270 : e == t && n == i && (c = 0);
return a > 0 ? 360 - c : -c;
},
getDistance: function(e, t, n, i) {
return Math.pow((e - t) * (e - t) + (n - i) * (n - i), .5);
}
};
t.exports = i;
cc._RF.pop();
}, {} ]
}, {}, [ "GameManager", "PlayerInfo", "SDKHelper", "SoundManager", "Utils", "AdView", "Arrow", "AwardView", "Boom", "GameView", "GotSkinView", "LevelBar", "LvProgressBar", "LvProgressItem", "OverView", "PauseView", "Player", "PolyTargetNode", "RankView", "ShopItem", "ShopView", "StartView", "Target" ]);