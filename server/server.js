const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 8080;
let app = express();
let server = http.createServer(app);
let io = socketio(server);

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

io.on("connection", (socket) => {
    socket.on("getFileContents", (filepath) => {
        let contents = fs.readFileSync(path.join(__dirname, "../", filepath), {
            encoding: "utf-8",
        });
        socket.emit("getFileContents", contents);
    });
    socket.on("saveFileContents", (data) => {
        dataObject = JSON.parse(data);
        fs.writeFileSync(dataObject.filename, dataObject.contents, {
            encoding: "utf-8",
        });
    });
});
