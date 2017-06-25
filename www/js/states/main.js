var GAME = GAME || {};

GAME.Main = function() {
};

GAME.Main.prototype.create = function() {
    let tile = new Tile(this.game, true, true, true, true);
    tile.draw();
};
