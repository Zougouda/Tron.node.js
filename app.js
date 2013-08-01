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
    console.log("   TRON - " + logMessage);
}

function newPlayer(name)
{
    tronLog(name + " has entered the race!");
    
    var playerColor = [Math.random() * 255 >> 0, Math.random() * 255 >> 0, Math.random() * 255 >> 0];
    var newBike = new Bike({}, WIDTH/2, HEIGHT/2, 6, 6, 1, 90, playerColor);
    var newPlayer = {
        userId: this.userId, 
        name: name, 
        bike:newBike,
        color: playerColor
    };
    
    this.emit("startPlaying", {
        userId: this.userId, 
        color: playerColor, 
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
        "/js/trail.js":true,
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
//io.enable('browser client minification');  // send minified client
//io.enable('browser client etag');          // apply etag caching logic based on version number
//io.enable('browser client gzip');          // gzip the file
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

    //Game Update Loop
setInterval(gameUpdateLoop, 50);

function gameUpdateLoop()
{
    for(i in players)
    {

        if(players[i].bike.x < 0
                || players[i].bike.x > WIDTH
                || players[i].bike.y < 0
                || players[i].bike.y > HEIGHT)
        {
            //client.emit("test");


            //tronLog("YOU'RE DEAD");
            //TODO : emit event to destroy the player
        }

        for(j in players)
        {
            if(
                players[i].bike.x < players[j].bike.x + players[j].bike.width
                && players[i].bike.y < players[j].bike.y + players[j].bike.height
                && players[j].bike.x < players[i].bike.x + players[i].bike.width
                && players[j].bike.y < players[i].bike.y + players[i].bike.height
                && players[j] != players[i]
              )
            {
                tronLog("COLLISION !!!");
                //TODO emit events to destroy both players
            }
        }
    } 
}
});

//external files includes
eval(fs.readFileSync(__dirname+'/js/config.js')+'');
eval(fs.readFileSync(__dirname+'/js/trail.js')+'');
eval(fs.readFileSync(__dirname+'/js/bike.js')+'');




//Start server
server.listen(portNumber);
tronLog("Server initialized. Now listening on port " + portNumber);
