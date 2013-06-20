var canvas = document.getElementById("canvas");
canvas.width = WIDTH
canvas.height = HEIGHT;

var ctx = canvas.getContext("2d");
ctx.font = "9px arial";

//function main()
//{
//    bikes = [];
//    myBike = new Bike(WIDTH/2-3 , HEIGHT/2-3, 6, 6, 1, 90);
//    bikes.push(myBike);
//    setInterval(game, DISPLAY_RATE);
//}

function main(data)
{
    //    bikes = [];
    bikes = {};
    
    
    //    console.log(bikes);
    
    player.bike = new Bike(player, data.yourBike.x, data.yourBike.y, data.yourBike.width, data.yourBike.height, data.yourBike.speed, data.yourBike.angle);
    
    //    bikes.push(player.bike);
    bikes[player.userId] = player.bike;
    
    //    bike = new Bike(player, data.yourBike.x, data.yourBike.y, data.yourBike.width, data.yourBike.height, data.yourBike.speed, data.yourBike.angle);
    //    bikes.push(bike);
    
    
    //    data.otherPlayers.forEach(function(otherPlayer){
    //        bikes.push(new Bike({
    //            name: otherPlayer.name, 
    //            userId: otherPlayer.userId
    //        }, otherPlayer.bike.x, otherPlayer.bike.y, otherPlayer.bike.width, otherPlayer.bike.height, otherPlayer.bike.speed, otherPlayer.bike.angle));
    //    });
    
    for(i in data.otherPlayers)
    {
        bikes[i] = new Bike({
            name: data.otherPlayers[i].name, 
            userId: data.otherPlayers[i].userId
        }, data.otherPlayers[i].bike.x, data.otherPlayers[i].bike.y, data.otherPlayers[i].bike.width, data.otherPlayers[i].bike.height, data.otherPlayers[i].bike.speed, data.otherPlayers[i].bike.angle);
    }
    
    setInterval(game, DISPLAY_RATE);
}

function game()
{
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    //    bikes.forEach(function(bike){
    //        bike.update();
    //        bike.draw();
    //    });

    for(i in bikes)
    {
        bikes[i].update();
        bikes[i].draw();
    }

}

addEventListener("keydown", function(e){
    if(e.keyCode == 39)
    {
        player.bike.changeAngle(0);
    }
    else if(e.keyCode == 38)
    {
        player.bike.changeAngle(90);
    }
    else if(e.keyCode == 37)
    {
        player.bike.changeAngle(180)
    }
    else if(e.keyCode == 40)
    {
        player.bike.changeAngle(270)
    }
});