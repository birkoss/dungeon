var GAME = GAME || {};

GAME.Main = function() {
    this.selectedTile = null;
};

GAME.Main.prototype.create = function() {
    this.gridContainer = this.game.add.group();
    this.grid = new Grid(this.game, 9, 9);
    this.grid.onTileDropped.add(this.newTurn, this);
    this.gridContainer.addChild(this.grid);

    this.tilesContainer = this.game.add.group();
    this.tilesContainer.y = this.gridContainer.y + 16 + this.gridContainer.height;

    for (let i=0; i<5; i++) {
        let tile = new Tile(this.game, true, true, true, true);
        tile.x = i * (64);
        tile.draw();
        tile.onClicked.add(this.selectTile, this);

        this.tilesContainer.addChild(tile);
    }
    this.selectTile(this.tilesContainer.getChildAt(0));
};

GAME.Main.prototype.selectTile = function(tile, pointer) {
    if (this.selectedTile != tile) {
        console.log("ST");
        if (this.selectedTile != null) {
            this.selectedTile.alpha = 1;
        }
        
        this.selectedTile = tile;
        this.selectedTile.alpha = 0.5;
    }

    this.grid.showArrows(this.selectedTile);
};

GAME.Main.prototype.newTurn = function() {
    console.log("new turn");
    this.grid.showArrows(this.selectedTile);
};
