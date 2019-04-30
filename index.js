var ws = require("nodejs-websocket");
console.log("开始建立连接...")
var catchs = [];
var server = ws.createServer(function(conn){
    conn.on('connect',function(){
        console.log("建立新连接")
        // catchs.push(1);
        // console.log(catchs)
    })
    conn.on("text", function (str) {
        console.log("收到的信息为:"+str)
        let data = JSON.parse(str);
        if(data.event=="新的连接"){
            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(catchs))
            })
        }
        if(data.event==1){
            server.connections.forEach(function (conn) {
                conn.sendText(str);
            })
            catchs.push(JSON.parse(str));
        }
        if(data.event==2){
            for(let i=0;i<catchs.length;i++){
                if(data.teamId==catchs[i].teamId){
                    catchs[i].currentPeople--;
                    if(catchs[i].currentPeople<=0){
                        let res = {
                            event:"空房间",
                            teamId:catchs[i].teamId
                        }
                        catchs.splice(i,1);
                        server.connections.forEach(function (conn) {
                            conn.sendText(JSON.stringify(res))
                        });
                    }else{
                        catchs[i].event=2;
                        server.connections.forEach(function (conn) {
                            conn.sendText(JSON.stringify(catchs[i]))
                        });
                    }
                    break;
                }
            }
        }
        if(data.event==3){
            for(let i=0;i<catchs.length;i++){
                if(data.teamId==catchs[i].teamId){
                    catchs[i].currentPeople++;
                    catchs[i].event=3;
                    server.connections.forEach(function (conn) {
                        conn.sendText(JSON.stringify(catchs[i]))
                    });
                    break;
                }
            }
        }
        if(data.event==4){
            for(let i=0;i<catchs.length;i++){
                if(data.teamId==catchs[i].teamId){
                    catchs[i].teamState=="游戏中";
                    catchs[i].event=4;
                    server.connections.forEach(function (conn) {
                        conn.sendText(JSON.stringify(catchs[i]))
                    });
                    break;
                }
            }
        }
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)
console.log("WebSocket建立完毕");