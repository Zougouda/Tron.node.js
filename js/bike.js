function Bike(player, x, y, width, height, speed, angle)
{
    this.player = player;
    this.x = x;
    this.y = y;
    this.width = (isset(width)) ? width : 10;
    this.height = (isset(height)) ? height : 10;
    this.speed = (isset(speed)) ? speed : 1;
    this.angle = (isset(angle)) ? angle : 90;
    
    this.draw = function(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText(this.player.name, this.x+this.width, this.y+this.height);
    };
    
    this.update = function(){
        switch(this.angle)
        {
            case 90:
                this.y -= 1;
                break;

            case 270:
                this.y += 1;
                break;

            case 0:
                this.x += 1;
                break;

            case 180:
                this.x -= 1;
                break;
        }
        socket.emit("updateBikePosition", {
            userId: player.userId,
            x: this.x, 
            y: this.y
        });
    };
    
    this.changeAngle = function(angle){
        this.angle = angle;
        socket.emit("updateBikeAngle", {
            userId: player.userId,
            angle: this.angle
        });
    }
}