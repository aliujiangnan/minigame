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

    var __proto = UserMgr.prototype;
    __proto.initUserInfo = function () {
        var token = localStorage.getItem('user_token')
        this.sign = token ? token : "notoken";
        localStorage.setItem('user_token', this.sign);
        var time = localStorage.getItem('user_signtime')
        this.signTime = time ? parseInt(time) : Date.now();
        localStorage.setItem('user_signtime', this.signTime);
        var id = localStorage.getItem('user_id')
        this.userId = id ? parseInt(id) : null;
        var name = localStorage.getItem('user_name');
        this.userName = name ? name : Date.now().toString();
        localStorage.setItem('user_name', this.userName);
        this.nickName = this.userName;
        this.avatar = "http://sandbox-avatar.boochat.cn/2018/01/20/02/3/0042758573.gif";
        this.sex = 1;
        this.score = 0;
        this.exp = 0;
        this.level = 1;
    };

    return UserMgr;
}());