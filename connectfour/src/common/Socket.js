
var MySocket = (function () {
    function MySocket(arg) {
        var url = arg.url;
        var ws = undefined;
        if ("WebSocket" in window) {
            ws = new WebSocket(url);
        }
        else if ("MozWebSocket" in window) {
            ws = new MozWebSocket(url);
        }
        this.socket = ws;
        this.cbRegister = {};

        function encodeUTF8(str){
            var temp = "",rs = "";
            for( var i=0 , len = str.length; i < len; i++ ){
                temp = str.charCodeAt(i).toString(16);
                rs  += "\\u"+ new Array(5-temp.length).join("0") + temp;
            }
            return rs;
        }
        function decodeUTF8(str){
            return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0,$1,$2){
                return String.fromCharCode(parseInt($2,16));
            }); 
        } 

        ws.onopen = function () {
            console.log("连接已经建立。OK");
            this.fire('connect', '');
        }.bind(this);

        ws.onmessage = function WSonMessage(event) {
            var ClientCmd, ServerCmd, ReqMsg, RetMsg;
            var lgdata;
            var tmpArg = event.data.split('\n');
            if (tmpArg[0] == 'cmd:0'){
                if (tmpArg[1][0] == '{'){
                    var dataObj = eval("("+tmpArg[1]+")");//转换为json对象 
                    ClientCmd = dataObj['ClientCmd'];
                    ServerCmd = dataObj['ServerCmd'];
                    ReqMsg    = dataObj['ReqMsg'];
                    RetMsg    = dataObj['RetMsg'];
                }
                else{
                    lgdata = decodeUTF8(tmpArg[1]);
                    console.log(lgdata);
                }
            }
            if (tmpArg[0] == 'cmd:1111'){
                console.log(event.data);
            }
            else{
                var cmdStr = tmpArg[0];
                for (var k in ServerCmd){
                    if ('cmd:'+ServerCmd[k] == cmdStr){
                        cmdStr = k +':';
                        break;
                    }
                }
                lgdata = decodeUTF8(tmpArg[1]);
                console.log('接收:'+cmdStr+'\n'+lgdata, 'OK');
                if (cmdStr == 'USER_INFO:'){
                    var dataMsg  = {'uid':0};
                    var jsonData = JSON.stringify(dataMsg);
                    var reqMsg   = 'cmd:11' +'\n'+jsonData;
                    ws.send(reqMsg);
                }
            }

            var obj = JSON.parse(lgdata);
            this.fire(obj.n, obj.d);
        }.bind(this);

        ws.onclose = function WSonClose() {
            console.log("WSonClose远程连接中断。");
            this.fire('close', 'onclose');
        }.bind(this);

        ws.onerror = function WSonError() {
            console.log("WSonError远程连接中断。");
            this.fire('error', 'onerror');
        }.bind(this);
    }

    var __proto = MySocket.prototype;
    __proto.on = function (name, func) {
        if (typeof this.cbRegister[name] == 'undefined') {
            this.cbRegister[name] = [func];
        }
        else {
            this.cbRegister[name].push(func);
        }
    }

    __proto.send = function (name, data) {
        var dataReq = JSON.stringify({
            n: name,
            d: data
        });
        this.socket.send(dataReq);
    }

    __proto.fire = function (name, data) {
        if (this.cbRegister[name] instanceof Array) {
            const handlers = this.cbRegister[name];
            handlers.forEach((handler) => {
                handler(data);
            })
        }
    }

    return MySocket;
}());
