/*
* Global;
*/
var Global = {
    stageWidth:750,
    stageHeight:1334,
    scaleY:1,
    scaleX:1,
    gameName: "Space Invader",
    robotType:0,
    testType:1, //0：单机 1：网络
    gameType:9,
    isMusicOn:true,
    serverAddress: "122.51.135.233:44000",
    maxPlayers: 2,
    seed:10,
    scores: [0, 0]
};

Global.levelData = {
    beeMoveSpeed: 100,
    playerBulletSpeed: 1000,
    beeBulletSpeed: 500,
    speedAddRate: 0.2,
    rowWidth: 50,
    colHeight: 50,
    0: {
        data: [
            [3, -1, -1, 3],
            [2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        height: 5,
        maxWidth: 8,
        num: 28
    },
    1: {
        data: [
            [3, -1, -1, 3],
            [2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        height: 5,
        maxWidth: 10,
        num: 36
    },
    2: {
        data: [
            [3, -1, -1, 3],
            [2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        height: 6,
        maxWidth: 10,
        num: 44
    },
    3: {
        data: [
            [3, -1, -1, 3],
            [2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        height: 6,
        maxWidth: 10,
        num: 42
    },
    4: {
        data: [
            [3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        height: 6,
        maxWidth: 10,
        num: 48
    },
    5: {
        data: [
            [3, 3, 3, 3],
            [2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        height: 6,
        maxWidth: 10,
        num: 48
    }
}