module.default = (function () {
    let ws = require('nodejs-websocket');
    console.log('开始建立连接...');

    let game = null, game1 = null, gameReady = false, game1Ready = false;
    let server = ws.createServer(function (conn) {
        conn.on('text', function (str = 'err') {
            if (str === 'game') {
                game = conn;
                gameReady = true;
                // conn.sendText('success');
            }
            if (str === 'game1') {
                game1 = conn;
                game1Ready = true;
            }
            console.log(gameReady, game1Ready);
            // if (gameReady) {
            //     game.sendText(str);
            // }
            // if (game1Ready) {
            //     game1.sendText(str);
            // }
            if (game1Ready && gameReady) {
                game1.sendText(str);
                game.sendText(str);
            } else {
                conn.sendText(str);
            }

            // console.log(str);
            // ;
        });
        conn.on('close', function (code, reason) {
            console.log('关闭连接');
        });
        conn.on('error', function (code, reason) {
            console.log('异常关闭');
        });
    }).listen(3002);
    console.log('WebSocket建立完毕');
})();
