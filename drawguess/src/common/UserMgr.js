/*
* UserMgr;
*/
var UserMgr = (function () {
    function UserMgr() {
        if (UserMgr.instance == null) {
            UserMgr.instance = this;
        }

        this.initUserInfo();
    }

    UserMgr.instance = null;

    function getLocalStorage(key, defautValue){
        var value = localStorage.getItem(key);
        return value ? value : defautValue
    }
    var __proto = UserMgr.prototype;
    __proto.initUserInfo = function () {
        this.sign = getLocalStorage("user_token", "notoken")
        localStorage.setItem("user_token", this.sign);
        this.signTime = getLocalStorage("user_signtime", Date.now())
        localStorage.setItem("user_signtime", this.signTime);
        this.userId = getLocalStorage("user_id", null);
        this.userId = this.userId ? parseInt(this.userId) : null;
        this.userName = getLocalStorage("user_name", Date.now().toString());
        localStorage.setItem("user_name", this.userName);
        this.nickName = this.userName;
        this.avatar = "http://sandbox-avatar.boochat.cn/2018/01/20/02/3/0042758573.gif";
        this.sex = 1;
        this.score = 0;
        this.exp = 0;
        this.level = 1;
    };
    
    return UserMgr;
}());