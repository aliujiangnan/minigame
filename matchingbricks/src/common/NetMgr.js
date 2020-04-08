/*
* NetMgr;
*/
var NetMgr = (function () {
    function NetMgr() {
        if (NetMgr.instance == null) {
            NetMgr.instance = this;
        }

        this.roomId = null;
        this.ping = null;
        this.seatIndex = 0;
        this.players = [];
        if (Global.testType != 0) {
            var socketUrl = 'ws://' + Global.serverAddress + '/socket';
            this.socket = new MySocket({ url: socketUrl });
            this.connected = false;
            this.initListeners();
        }
    }

    NetMgr.instance = null;

    var seatInfo = {
        userId: 2,
        userName: null,
        nickName: "Saa",
        avatar: "http://sandbox-avatar.boochat.cn/2018/01/20/02/3/0042758573.gif",
        sex: 1,
        level: 1,
        score: 0,
        index: 1,
        online: false,
    };

    var __proto = NetMgr.prototype;
     __proto.putSeatInfo = function (player, index) {
        var seat = seatInfo;
        seat.userId = player.id;
        seat.userName = player.user;
        seat.nickName = player.nick;
        seat.avatar = player.avatar;
        seat.sex = player.gender;
        seat.score = player.score;
        seat.level = player.level;
        seat.online = player.online;
        seat.index = index;

        return seat;
    }

    __proto.getOpponent = function () {
        if (Global.testType == 0) {
            return seatInfo;
        }
        else {
            for (var i = 0; i < this.players.length; ++i) {
                if (this.players[i].id != UserMgr.instance.userId) {
                    var player = this.players[i];
                    return this.putSeatInfo(player, i);
                }
            }            
        }
    };

    __proto.login = function () {
        var data = {
            'time': UserMgr.instance.signTime,
            'sign': UserMgr.instance.sign,
            'game': Global.gameType,
            'id': UserMgr.instance.userId,
            'user': UserMgr.instance.userName,
            'nick': UserMgr.instance.nickName,
            'avatar': UserMgr.instance.avatar,
            'gender': UserMgr.instance.sex,
        }

        this.socket.send('login', data);
    };

    __proto.initListeners = function () {
        this.socket.on('connect', function () {
            console.log("on.connect");
            this.login();
        }.bind(this));

        this.socket.on('error', function (err) {
            console.error('WS error:', err);
        }.bind(this));

        this.socket.on('game.init', function (data) {
            UserMgr.instance.userId = data.id;
            UserMgr.instance.sign = data.token;
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('user_token', data.token);
            UserMgr.instance.score = data.score;
            UserMgr.instance.exp = data.exp;
            UserMgr.instance.level = data.lv;
            this.connected = true;
            this.pingServer();
            this.ping = 10;
        }.bind(this));

        this.socket.on('game.begin', function (data) {
            this.roomId = data.id;
            this.players = data.players;
            Global.seed = data.s;
            Global.robotType = data.robot;
            for (var i = 0; i < this.players.length; ++i) {
                if (this.players[i].id == UserMgr.instance.userId) {
                    this.seatIndex = i;
                    break
                }
            }

            EventHelper.instance.event("game_start", { time: data.t })
        }.bind(this));

        this.socket.on('player.msg', function (data) {
            EventHelper.instance.event("player_msg", data)
        }.bind(this));

        this.socket.on('player.emoji', function (data) {
            EventHelper.instance.event("player_emoji", [data, 1])
        }.bind(this));

        this.socket.on('player.again', function (data) {
            EventHelper.instance.event("player_again", data)
        }.bind(this));

        this.socket.on('game.dissolve', function (data) {
            this.roomId = null;
            this.players = [];
            EventHelper.instance.event("game_dissolve", data)
        }.bind(this));

        this.socket.on('game.over', function (data) {
            EventHelper.instance.event("game_over", data)
        }.bind(this));

        this.socket.on('game.pong', function (data) {
            this.ping = Date.now() - this.pingTime;
        }.bind(this));

        this.socket.on('user.offline', function (data) {
            var opponent = this.getOpponent();
            this.players[opponent.index].online = false;
            EventHelper.instance.event('opponent_left', seat);
        }.bind(this));
    }

    __proto.send = function (name, data) {
        this.socket.send(name, data == undefined ? "" : data);
    }

    __proto.pingServer = function () {
        this.send("ping");
        this.pingTime = Date.now();
        Laya.timer.once(3000, this, this.pingServer);
    }
    return NetMgr;
}());