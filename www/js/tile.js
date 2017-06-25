function Tile(game) {
    Phaser.Group.call(this, game);
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;
