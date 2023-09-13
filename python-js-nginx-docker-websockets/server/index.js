const os = require("os");
const process = require("process");
const http = require("http");

const WebSocketServer = require("websocket").server;

const PORT = 8080;
let connection = null;

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer();

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const websocket = new WebSocketServer({
    httpServer: httpserver,
});

httpserver.listen(PORT, () =>
    console.log(
        `I am a ws server on ${os.hostname()} with PID ${
            process.pid
        } listening on port ${PORT}`
    )
);

//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it!
websocket.on("request", (request) => {
    connection = request.accept(null, request.origin);
    connection.on("close", () => console.log("CLOSED!!!"));
    connection.on("message", (message) => {
        console.log(
            `Received message on ${os.hostname()}:${PORT}: ${message.utf8Data}`
        );
        connection.send(
            `Server ${os.hostname()}:${PORT} responded to your message: ${
                message.utf8Data
            }`
        );
    });
});
