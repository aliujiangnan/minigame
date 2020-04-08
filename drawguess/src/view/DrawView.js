var Painter = {
    container: null,
    canvas: null,
    lastX: 0,
    lastY: 0,
    hasTouch: false,
    ctx: 0,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: 0,
    height: 0,
};

function initPainter() {
    if(Painter.container){
        Painter.container.style.display = "";
        return;
    }
    Painter.container = document.getElementById("painterContainer");
    Painter.container.style.display = "";

    Painter.top = Laya.Browser.clientHeight * 0.11;
    Painter.bottom = Laya.Browser.clientHeight * 0.337;
    Painter.right = Laya.Browser.clientWidth * 0.0;
    Painter.left = Laya.Browser.clientWidth * 0.0;
    Painter.container.style.top = Painter.top + "px";
    Painter.container.style.bottom = Painter.bottom + "px";
    Painter.container.style.right = Painter.right + "px";
    Painter.container.style.left = Painter.left + "px";

    Painter.canvas = document.getElementById("painterCanvas");

    Painter.width = Laya.Browser.clientWidth - Painter.right - Painter.right;
    Painter.height = Laya.Browser.clientHeight - Painter.top - Painter.bottom;
    Painter.canvas.width = Painter.width;
    Painter.canvas.height = Painter.height;

    Painter.ctx = Painter.canvas.getContext("2d");

    Painter.ctx.lineWidth = 8;//画笔粗细
    Painter.ctx.strokeStyle = "#000000";//画笔颜色
    Painter.ctx.fillStyle = "#000000";
}
function createTouch() {
    var touchable = 'createTouch' in document;
    if (touchable) {
        Painter.canvas.addEventListener('touchstart', onTouchStart, false);
        Painter.canvas.addEventListener('touchmove', onTouchMove, false);
    }
    else {
        Painter.canvas.addEventListener('mousedown', onMouseDown, false);
        Painter.canvas.addEventListener('mousemove', onMouseMove, false);
        Painter.canvas.addEventListener('mouseup', onMouseUp, false);
        Painter.canvas.addEventListener('mouseout', onMouseUp, false);
    }
}

function closeTouch() {
    var touchable = 'createTouch' in document;
    if (touchable) {
        Painter.canvas.removeEventListener('touchstart', onTouchStart, false);
        Painter.canvas.removeEventListener('touchmove', onTouchMove, false);
    }
    else {
        Painter.canvas.removeEventListener('mousedown', onMouseDown, false);
        Painter.canvas.removeEventListener('mousemove', onMouseMove, false);
        Painter.canvas.removeEventListener('mouseup', onMouseUp, false);
        Painter.canvas.removeEventListener('mouseout', onMouseUp, false);
    }
}

function clearCanvas() {
    Painter.ctx.clearRect(0, 0, Painter.canvas.width, Painter.canvas.height);
}

//触摸开始事件
function onTouchStart(event) {
    event.preventDefault();
    lastX = event.touches[0].clientX - Painter.right;
    lastY = event.touches[0].clientY - Painter.top;
    drawRound(lastX, lastY);
}

function onMouseDown(event) {
    event.preventDefault();
    lastX = event.layerX;
    lastY = event.layerY;
    Painter.hasTouch = true;
    drawRound(lastX, lastY);
}

//触摸滑动事件
function onTouchMove(event) {
    try {
        event.preventDefault();
        drawLine(lastX, lastY, event.touches[0].clientX - Painter.right, event.touches[0].clientY - Painter.top);
        lastX = event.touches[0].clientX - Painter.right;
        lastY = event.touches[0].clientY - Painter.top;
    }
    catch (err) {
        alert(err.description);
    }
}

function onMouseMove(event) {
    if (!Painter.hasTouch) return;
    try {
        event.preventDefault();
        drawLine(lastX, lastY, event.layerX, event.layerY);
        lastX = event.layerX;
        lastY = event.layerY;
        
    }
    catch (err) {
        alert(err.description);
    }
}

function onMouseUp(event) {
    Painter.hasTouch = false;
}

//画圆
function drawRound(x, y, isCmd) {
    Painter.ctx.beginPath();
    Painter.ctx.arc(x, y, Painter.ctx.lineWidth / 2, 0, Math.PI * 2, true);
    Painter.ctx.closePath();
    Painter.ctx.fill();

    if (!isCmd) {
        EventHelper.instance.event("draw_round", [x, y]);
    }
}
//画线
function drawLine(startX, startY, endX, endY, isCmd) {
    Painter.ctx.beginPath();
    Painter.ctx.lineCap = "round";
    Painter.ctx.moveTo(startX, startY);
    Painter.ctx.lineTo(endX, endY);
    Painter.ctx.stroke();
    if (!isCmd) {
        EventHelper.instance.event("draw_line", [startX, startY, endX, endY]);
    }
}

/*
* DrawView;
*/
var DrawView = (function (_super) {
    function DrawView() {
        DrawView.super(this);
        this.size(Laya.stage.width, Laya.stage.height);
        this.initSelf();
    }

    Laya.class(DrawView, "DrawView", _super);

    var __proto = DrawView.prototype;
    __proto.initSelf = function () {
        initPainter();
        EventHelper.instance.on("draw_round", this, function (x, y) {
            var data = {
                shape: "round",
                x: x / Painter.width, y: y / Painter.height,
            }
            NetMgr.instance.send('shape', data);
        });

        EventHelper.instance.on("draw_line", this, function (startX, startY, endX, endY) {
            var data = {
                shape: "line",
                startX: startX / Painter.width, startY: startY / Painter.height, endX: endX / Painter.width, endY: endY / Painter.height,
            }
           NetMgr.instance.send('shape', data);
        });

        var sp = new Laya.Sprite();
        sp.y = Laya.stage.height * 0.108;
        this.addChild(sp);
        this.panel = sp;
    }
    __proto.drawCanvas = function(){
        var tempSrc = Painter.canvas.toDataURL("image/png");
        this.canvaSrc = tempSrc;
        // this.panel.graphics.drawRect(0,0,this.width,this.height * 0.556, "#ff0000");
        // Painter.container.style.display = "none";
        this.panel.loadImage(tempSrc,0,0,this.width,this.height * 0.556,Laya.Handler.create(this,function(){
            Painter.container.style.display = "none";
        }));
    }
    __proto.clearCanvas = function(){
        this.panel.graphics.clear();        
        Painter.container.style.display = "";
    }
    __proto.onDraw = function (data) {
        if (data.shape == "round") {
            drawRound(data.x * Painter.width, data.y * Painter.height, true)
        }
        else if (data.shape == "line") {
            drawLine(data.startX * Painter.width, data.startY * Painter.height, data.endX * Painter.width, data.endY * Painter.height, true)
        }
    }

    return DrawView;
}(Laya.View));
