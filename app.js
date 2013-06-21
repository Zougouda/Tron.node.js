//Server variables
var http = require('http'),
url = require("url"),
fs = require("fs"),
html = fs.readFileSync(__dirname+'/index.html'),
portNumber = 8000,
server = http.createServer();

//game variables
var clientsIterator = 0;
//var players = [];
var players = {};

function tronLog(logMessage)
{
    console.log("\tTRON - " + logMessage);
}

function newPlayer(name)
{
    tronLog(name + " has entered the race!");
    
    var newBike = new Bike({}, WIDTH/2, HEIGHT/2, 6, 6, 1, 90);
    var newPlayer = {
        userId: this.userId, 
        name: name, 
        bike:newBike
    };
    
    this.emit("startPlaying", {
        userId: this.userId, 
        yourBike: newBike,
        otherPlayers: players
    });
    
    //    players.push(newPLayer);
    players[this.userId] = newPlayer;
    
    this.broadcast.emit("newPlayer", newPlayer);
}

function playerLeave()
{
    this.broadcast.emit("playerLeave", this.userId);
    delete players[this.userId];
    tronLog('PLAYER LEFT ' + this.userId );
}

function updateBikePosition(data)
{
    if(isset(players[data.userId]))
    {
        //    console.log("\t new coords for bike #" + data.userId + " ("+data.x+", "+data.y+")");
        players[data.userId].bike.x = data.x;
        players[data.userId].bike.y = data.y;
    }
}

function updateBikeAngle(data)
{
    if(isset(players[data.userId]))
    {
        tronLog("new Angle for bike #" + data.userId + " ("+data.angle+")");
        players[data.userId].bike.angle = data.angle;
        this.broadcast.emit("updateBikeAngle", data);
    }
}

//Server
server.on("request", function (req, res) {
    tronLog("receiving " + req.method  + " request from " + req.headers.host  + " on " + req.url );
    
    //On déclare un objet contenant les ressources externes à charger (styles et scripts)
    var allowedRessources = {
        "/js/main.js":true,
        "/js/config.js":true,
        "/js/bike.js":true,
        "/css/style.css":true
    };
    if(url.parse(req.url).pathname in allowedRessources && allowedRessources[url.parse(req.url).pathname])
    { 
        var ressource = fs.readFileSync(__dirname+url.parse(req.url).pathname);
        res.end(ressource);
    }
    else
        res.end(html);
});

//socket.io
var io = require("socket.io").listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 2);                    // reduce logging


io.sockets.on("connection", function(client){
    
    client.userId = clientsIterator++;
    
    client.emit("isConnected", {
        userId: client.userId
    });
    
    client.on("newPlayer", newPlayer); 
    
    client.on('disconnect', playerLeave);
    
    client.on("updateBikePosition", updateBikePosition);

    client.on("updateBikeAngle", updateBikeAngle);
});

//external files includes
eval(fs.readFileSync(__dirname+'/js/config.js')+'');
eval(fs.readFileSync(__dirname+'/js/bike.js')+'');

//Start server
server.listen(portNumber);
tronLog("Server initialized. Now listening on port " + portNumber);
