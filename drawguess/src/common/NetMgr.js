/*
* NetMgr;
*/
var NetMgr = (function () {
    function NetMgr() {
        if (NetMgr.instance == null) {
            NetMgr.instance = this;
        }

        this.roomId = null;
        this.creator = null;
        this.ping = null;
        this.painterIndex = 0;
        this.seatIndex = 0;
        this.isPlayer = false;
        this.players = [];
        this.obsers = [];
        var socketUrl = 'ws://' + Global.serverAddress + '/socket';
        this.socket = new MySocket({ url: socketUrl });
        this.connected = false;

        this.initListeners();
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
        isPlayer: false,
        ready: false,
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
        seat.exp = player.exp;
        seat.isPlayer = player.isplayer;
        seat.online = player.online;
        seat.ready = player.ready;
        seat.index = player.index != null? player.index : index;

        return seat;
    }
    __proto.getSeatById = function (id) {
        for (var i = 0; i < this.players.length; ++i) {
            if (this.players[i].id == id) {
                var player = this.players[i];
                return this.putSeatInfo(player, i);
            }
        }
        return null;
    };

    __proto.getObserById = function (id) {
        for (var i = 0; i < this.obsers.length; ++i) {
            if (this.obsers[i].id == id) {
                var player = this.obsers[i];
                return this.putSeatInfo(player, i);
            }
        }
        return null;
    };

    __proto.getSeat = function (index) {
        var player = null;
        for(var i = 0; i < this.players.length; ++i){
            if(index == this.players[i].index){
                player = this.players[i];
            }
        }
        if (player == null) player = this.players[index];
        if (player == null) return null;
        return this.putSeatInfo(player, index);
    };

    __proto.getObser = function (index) {
        var player = null;
        for(var i = 0; i < this.obsers.length; ++i){
            if(index == this.obsers[i].index){
                player = this.obsers[i];
            }
        }
        if (player == null) player = this.obsers[index];
        if (player == null) return null;
        return this.putSeatInfo(player, index);
    };

    __proto.getPainter = function () {
        return this.getSeat(this.painterIndex);
    };

    __proto.getObsNum = function () {
        return this.obsers.length;
    }

    __proto.getPlayerNum = function () {
        return this.players.length;
    }

    __proto.getReadyNum = function () {
        var n = 0;
        for (var i = 0; i < this.players.length; ++i) {
            if (this.players[i].ready) n++;
        }
        return n
    }

    __proto.getOlPlayerNum = function () {
        var n = 0;
        for (var i = 0; i < this.players.length; ++i) {
            if (this.players[i].online) n++;
        }
        return n
    }

    __proto.isFullReady = function () {
        return this.getReadyNum() == this.getOlPlayerNum() && this.getOlPlayerNum() == Global.maxPlayers;
    }

    __proto.isCreator = function () {
        return this.creator == UserMgr.instance.userId;
    };

    __proto.isPainter = function () {
        return this.seatIndex == this.painterIndex;
    };

    __proto.clearRoom = function () {
        this.roomId = null;
        this.isPlayer = false;
        this.creator = null
        this.painterIndex = 0;
        this.seatIndex = 0;
        this.players = [];
        this.obsers = [];
    };

    __proto.login = function () {
        var data = {
            'time': UserMgr.instance.signTime,
            'sign': UserMgr.instance.sign,
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
            Global.timeOffset = data.t * 1000 - Date.now();
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

        this.socket.on('game.enter', function (data) {
            this.roomId = data.id;
            this.creator = data.crter;
            this.players = data.members.players;
            this.obsers = data.members.obsers;
            for (var i = 0; i < this.players.length; ++i) {
                if (this.players[i].id == UserMgr.instance.userId) {
                    this.seatIndex = this.players[i].index == undefined ? i : this.players[i].index;
                    this.isPlayer = this.players[i].isplayer;
                    break
                }
            }

            if (data.info) {
                if (data.info.state != "over")
                    this.painterIndex = data.info.idx;
            }
            Global.seed = data.s;

            EventHelper.instance.event("enter_room", data.info)
        }.bind(this));

        this.socket.on('game.over', function (data) {
            for (var i = 0; i < this.players.length; ++i) {
                this.players[i].ready = false;
            }
            EventHelper.instance.event("game_over", data)
        }.bind(this));

        this.socket.on('game.pong', function (data) {
            this.ping = Date.now() - this.pingTime;
        }.bind(this));

        this.socket.on('game.exit', function (data) {
            this.clearRoom();
            EventHelper.instance.event("exit_room", data);
        }.bind(this));

        this.socket.on('game.refresh', function (data) {
            EventHelper.instance.event('refresh_info', data);
        }.bind(this));

        this.socket.on('user.new', function (data) {
            this.players = data.members.players;
            this.obsers = data.members.obsers;
            var seat = data.isplayer ? this.getSeatById(data.id) : this.getObserById(data.id);
            EventHelper.instance.event('new_user', seat);
        }.bind(this));

        this.socket.on('user.standup', function (data) {
            this.players = data.members.players;
            this.obsers = data.members.obsers;
            if (data.id == UserMgr.instance.userId) {
                this.isPlayer = false;
                this.seatIndex = -1;
            }
            EventHelper.instance.event('change_seat', data);
        }.bind(this));

        this.socket.on('user.sitdown', function (data) {
            this.players = data.members.players;
            this.obsers = data.members.obsers;
            var seat = this.getSeatById(data.id);
            if (data.id == UserMgr.instance.userId) {
                this.isPlayer = true;
                this.seatIndex = seat.index;
            }
            EventHelper.instance.event('change_seat', data);
        }.bind(this));

        this.socket.on('user.state', function (data) {
            var seat = this.getSeatById(data.id);
            if (seat) {
                this.players[seat.index].online = data.online;
            }
            else {
                seat = this.getObserById(data.id);
                this.obsers[seat.index].online = data.online;
            }

            if (Global.gameInstance.state == "idle") {
                this.players = data.members.players;
                this.obsers = data.members.obsers;
            }
            EventHelper.instance.event('user_state_changed', seat);
        }.bind(this));

        this.socket.on('game.allready', function (data) {
            EventHelper.instance.event('all_ready', data);
        }.bind(this));

        this.socket.on('game.begin', function (data) {
            this.painterIndex = data.idx;
            EventHelper.instance.event('game_begin', data);
        }.bind(this));

        this.socket.on('game.select', function (data) {
            this.painterIndex = data.idx;
            EventHelper.instance.event('player_select', data);
        }.bind(this));

        this.socket.on('game.draw', function (data) {
            this.painterIndex = data.idx;
            EventHelper.instance.event('draw_begin', data);
        }.bind(this));

        this.socket.on('player.invite', function (data) {
            EventHelper.instance.event('invite', data);
        }.bind(this));

        this.socket.on('player.ready', function (data) {
            var seat = this.getSeatById(data.id);
            this.players[seat.index].ready = true;
            EventHelper.instance.event('user_ready', seat);
        }.bind(this));

        this.socket.on('player.cancel', function (data) {
            var seat = this.getSeatById(data.id);
            this.players[seat.index].ready = false;
            EventHelper.instance.event('cancel_ready', seat);
        }.bind(this));

        this.socket.on('cmd.shape', function (data) {
            EventHelper.instance.event('cmd_shape', data);
        }.bind(this));

        this.socket.on('cmd.tool', function (data) {
            EventHelper.instance.event('cmd_tool', data);
        }.bind(this));

        this.socket.on('game.commit', function (data) {
            EventHelper.instance.event('commit_result', data);
        }.bind(this));

        this.socket.on('game.result', function (data) {
            EventHelper.instance.event('answer_result', data);
        }.bind(this));

        this.socket.on('game.answer', function (data) {
            EventHelper.instance.event('show_answer', data);
        }.bind(this));

        this.socket.on('game.kick', function (data) {
            this.clearRoom();
            EventHelper.instance.event("kick_player", data);
        }.bind(this));

        this.socket.on('game.chat', function (data) {
            EventHelper.instance.event("chat", data);
        }.bind(this));
    }

    __proto.send = function (name, data) {
        console.log("n", name, "d", data);
        this.socket.send(name, data == undefined ? "" : data);
    }

    __proto.pingServer = function () {
        this.send("ping");
        this.pingTime = Date.now();
        Laya.timer.once(3000, this, this.pingServer);
    }

    return NetMgr;
}());