/*
* HttpHelper;
*/
var HttpHelper = (function () {
    function HttpHelper() {
    }

    HttpHelper.send = function (method, path, data, callback, timeout){
        return new HttpReq(method, path, data, timeout).send(callback);
    }

    return HttpHelper;
}());

var HttpReq = (function () {
    function HttpReq(method, path, data, timeout) {
        this.method = method;
        this.path = path;
        this.data = data;
        this.timeout = timeout ? timeout : 5000;
    }

    var baseUrl = "http://122.51.135.233:443";

    var __proto = HttpReq.prototype;
    __proto.send = function (requestComplete) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = this.timeout;
        var data = null;
        
        if (this.method == "post") {
            xhr.open(this.method, baseUrl + this.path, true);
            xhr.setRequestHeader("Content-Type", "application/json")
            var json = JSON.stringify(this.data);
            data = this.BodyToSend(json);
        }
        else {
            var data = "";
            if(this.data){
                data = "?";
                for(var k in this.data){
                    if(data != "?"){
                        data += "&";
                    }
                    data += k + "=" + this.data[k];
                }
            }

            xhr.open(this.method, baseUrl + this.path + data, true);
        }
        
        var timeout = false;
        var onTimeout = setTimeout(function(){
            timeout = true;
            requestComplete({
                error:"request timeout"
            });
        }, this.timeout)

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                try {
                    var res = JSON.parse(xhr.responseText);
                    if (!timeout && requestComplete != undefined) {
                        clearTimeout(onTimeout)
                        requestComplete(res);
                    }
                } catch (e) {
                    console.log("err:" + e);
                }
                finally{
                    //TODO:
                }                
            }
        }.bind(this);        
        
        xhr.send(data)
    }

    return HttpReq;
}());



