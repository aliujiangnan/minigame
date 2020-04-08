"use strict";
cc._RF.push(module, '6e75ap6EtNPnrSfWGyYQsqc', 'HttpApi');
// script/utils/HttpApi.js

"use strict";

var AesCbc = require("AesCbc");
/*
* HttpApi;
*/
var HttpApi = function () {
    function HttpApi(method, path, data, timeout) {
        this.method = method;
        this.path = path;
        this.data = data;
        this.timeout = timeout ? timeout : 5000;
        if (data && method == "post") {
            this.data["t"] = Date.now();
        }
        var token = localStorage.getItem(tokenkey);
        this.token = token == null ? "notoken" : token;
    }

    var baseUrl = "http://127.0.0.1:443";
    var tokenkey = "test-token";

    HttpApi.create = function (method, path, data, timeout) {
        return new HttpApi(method, path, data, timeout);
    };

    var __proto = HttpApi.prototype;
    __proto.send = function (requestComplete) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = this.timeout;
        var data = null;

        if (this.method == "post") {
            xhr.open(this.method, baseUrl + this.path, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            var json = JSON.stringify(this.data);
            data = this.BodyToSend(json);
        } else {
            xhr.open(this.method, baseUrl + this.path + "?" + this.data, true);
        }

        if (this.path != "/login") {
            xhr.setRequestHeader("Authorization", "Bearer " + this.token);
        }
        if (this.path == "/login" || this.path == "/score/report" || this.path == "/exp/add") {
            xhr.setRequestHeader("up-encode", "1");
        } else {
            xhr.setRequestHeader("up-encode", "0");
        }

        var timeout = false;
        var onTimeout = setTimeout(function () {
            timeout = true;
            requestComplete({
                Error: "request timeout"
            });
        }, this.timeout);

        // xhr.ontimeout = function(){
        //     requestComplete({
        //         Error:"request timeout"
        //     });
        // };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var res = this.Parse(xhr);
                if (!timeout && requestComplete != undefined) {
                    clearTimeout(onTimeout);
                    requestComplete(res);
                }
            }
        }.bind(this);

        xhr.send(data);
    };

    __proto.Parse = function (xhr) {
        var data = xhr.responseText;
        var responseError = null;
        if (xhr.status == 200) {
            if (this.path == "/login") {
                var loginObj = JSON.parse(data);
                localStorage.setItem(tokenkey, loginObj.data.token);
            }
        } else if (data == "") {
            responseError = "cannot connect to server";
        } else {
            responseError = JSON.parse(data);
        }

        var responseAll = {
            Error: responseError,
            data: data,
            StatusCode: xhr.status
        };

        return responseAll;
    };

    __proto.BodyToSend = function (data) {
        var postBody;
        if (this.path == "/login" || this.path == "/score/report" || this.path == "/exp/add") {
            var eData = AesCbc.encode(data);
            postBody = "{\"data\":\"" + eData + "\"}";
        } else {
            postBody = "{\"data\":" + data + "}";
        }

        return postBody;
    };

    return HttpApi;
}();

module.exports = HttpApi;

cc._RF.pop();