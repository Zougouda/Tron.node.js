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

function newPlayer(name)
{
    console.log("\tinfo: " + name + " has entered the race!");
    
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
    console.log("RAGGGGGGGE QUIIIIIIIIT !!!");
}

function updateBikePosition(data)
{
    //    console.log("\t new coords for bike #" + data.userId + " ("+data.x+", "+data.y+")");
    players[data.userId].bike.x = data.x;
    players[data.userId].bike.y = data.y;
}

function updateBikeAngle(data)
{
        console.log("\t new Angle for bike #" + data.userId + " ("+data.angle+")");
    players[data.userId].bike.angle = data.angle;
    this.broadcast.emit("updateBikeAngle", data);

}

//Server
server.on("request", function (req, res) {
    console.log("receiving " + req.method  + " request from " + req.headers.host  + " on " + req.url );
    
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


io.sockets.on("connection", function(client){
    
    client.userId = clientsIterator++;
    
    client.emit("isConnected", {
        userId: client.userId
    });
    
    client.on("newPlayer", newPlayer); 
    
    client.on('disconnect', function () {
        
        //Useful to know when someone disconnects
        console.log('\tinfo: ' + client.userId );
    
    });
    
    client.on("updateBikePosition", updateBikePosition);
    client.on("updateBikeAngle", updateBikeAngle);
});

//external files includes
eval(fs.readFileSync(__dirname+'/js/config.js')+'');
eval(fs.readFileSync(__dirname+'/js/bike.js')+'');

//Start server
server.listen(portNumber);
console.log("Server initialized. Now listening on port " + portNumber);
