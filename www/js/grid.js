function Grid(game, gridWidth, gridHeight) {
    Phaser.Group.call(this, game);

    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.tiles = [];

    for (gridY=0; gridY<gridHeight; gridY++) {
        let rows = [];
        for (gridX=0; gridX<gridWidth; gridX++) {
            let tile = new Tile(this.game, true, true, true, true);
            tile.gridX = gridX;
            tile.gridY = gridY;
            tile.x = gridX * (tile.width+1);
            tile.alpha = 0.5;
            tile.y = gridY * (tile.height+1);
            this.backgroundContainer.addChild(tile);
            rows.push(tile);
        }
        this.tiles.push(rows);
    }

    this.addTileAt(new Tile(this.game, true, true, true, true), 4, 4);
    this.addTileAt(new Tile(this.game, true, false, true, false), 4, 5);
};

Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.addTileAt = function(tile, gridX, gridY) {
    this.tiles[gridY][gridX] = tile;
    tile.gridX = gridX;
    tile.gridY = gridY;
    tile.x = gridX * (tile.width+1);
    tile.y = gridY * (tile.height+1);
    tile.draw();
};
