function Trail(player, x, y)
{
    this.player = player;
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;

    console.log(this.player);

    this.draw = function()
    {
        ctx.strokeStyle = "rgba("+this.player.color[0]+", "+this.player.color[1]+", "+this.player.color[2]+", 1)";

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.stroke(); 
    }
}
