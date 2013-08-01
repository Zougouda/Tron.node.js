function Bike(player, x, y, width, height, speed, angle, color)
{
    this.player = player;
    this.x = x;
    this.y = y;
    this.width = (isset(width)) ? width : 10;
    this.height = (isset(height)) ? height : 10;
    this.speed = (isset(speed)) ? speed : 1;
    this.angle = (isset(angle)) ? angle : 90;
    //this.color = ( typeof color != "undefined" ) ? color : [Math.random() * 255 >> 0, Math.random() * 255 >> 0, Math.random() * 255 >> 0];

    this.color = this.player.color;

    
    this.draw = function(){
        ctx.fillStyle = "rgba("+this.color[0]+", "+this.color[1]+", "+this.color[2]+", 1)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillText(this.player.name, this.x+this.width, this.y+this.height);
    };
    
    this.update = function(){
        switch(this.angle)
        {
            case 90:
                this.y -= 1;
                this.lastTrail.height -= 1;
                break;

            case 270:
                this.y += 1;
                this.lastTrail.height += 1;
                break;

            case 0:
                this.x += 1;
                this.lastTrail.width += 1;
                break;

            case 180:
                this.x -= 1;
                this.lastTrail.width -= 1;
                break;
        }

        //console.log(this.x, this.y, this.lastTrail.width, this.lastTrail.height);

        socket.emit("updateBikePosition", {
            userId: player.userId,
            x: this.x, 
            y: this.y
        });
    };
    
    this.changeAngle = function(angle){
        if(angle != Math.abs(this.angle-180))
        {
            this.angle = angle;
            this.newTrail();
            socket.emit("updateBikeAngle", {
                userId: player.userId,
                angle: this.angle
            });
        }
    }

    this.newTrail = function()
    {
        this.lastTrail = new Trail(this.player, this.x, this.y);
        if(typeof trails != "undefined")
            trails[trailsIndex++] = this.lastTrail;
    }

    this.newTrail();
}
