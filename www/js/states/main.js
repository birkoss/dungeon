var GAME = GAME || {};

GAME.Main = function() {
    this.selectedTile = null;
};

GAME.Main.prototype.create = function() {
    this.gridContainer = this.game.add.group();
    this.grid = new Grid(this.game, 9, 9);
    this.grid.onTileDropped.add(this.newTurn, this);
    this.gridContainer.addChild(this.grid);
    this.gridContainer.x = (this.game.width - this.grid.width) / 2;

    this.tilesContainer = this.game.add.group();
    this.tilesContainer.y = this.gridContainer.y + 16 + this.gridContainer.height;

    this.previewContainer = this.game.add.group();

    let pool = [
        {layout:1, nbr:1},
        {layout:2, nbr:5},
        {layout:3, nbr:20},
        {layout:4, nbr:10},
        {layout:5, nbr:5}
    ];
    this.layouts =  [];
    pool.forEach(function(single_pool) {
        for (let i=0; i<single_pool.nbr; i++) {
            this.layouts.push(single_pool.layout);
        }
    }, this);

    this.layouts = Phaser.ArrayUtils.shuffle(this.layouts);

    for (let i=0; i<5; i++) {
        let background = this.tilesContainer.create((i+0) * (this.grid.width/5), 0, "tile:selector");
        let tile = this.createTile(i, this.layouts.shift());
    }
    this.tilesContainer.x = (this.game.width - this.tilesContainer.width) / 2;

    let preview = this.previewContainer.create(0, 0, "tile:selector");
    preview.frame = 2;
    preview.scale.set(2);

    this.previewContainer.y = this.tilesContainer.y + this.tilesContainer.height + 16;
    this.previewContainer.x = (this.game.width - this.previewContainer.width) / 2;

    this.selectTile(this.tilesContainer.getChildAt(0).getChildAt(0));
};

GAME.Main.prototype.selectTile = function(tile, pointer) {
    if (this.selectedTile == tile) {
        /* Rotate the same tile */
        tile.rotateWays();
        this.previewContainer.getChildAt(1).ways = tile.ways;
        this.previewContainer.getChildAt(1).draw();
    } else {
        /* Select a new tile */
        if (this.selectedTile != null && this.selectedTile.parent != null) {
            this.selectedTile.parent.frame = 0;
        }
        
        this.selectedTile = tile;
        this.selectedTile.parent.frame = 1;

        if (this.previewContainer.children.length > 1) {
            this.previewContainer.getChildAt(1).destroy();
        }

        let preview = new Tile(this.game);
        preview.ways = this.selectedTile.ways;
        preview.draw();

        preview.scale.set(2);

        this.previewContainer.addChild(preview);
        preview.x = (this.previewContainer.width - preview.width) / 2;
        preview.y = (this.previewContainer.height - preview.height) / 2;
    }

    this.grid.showArrows(this.selectedTile);
};

GAME.Main.prototype.createTile = function(index, layout) {
    let tile;
    switch (layout) {
        case 1: /* + */
            tile = new Tile(this.game, true, true, true, true);
            break;
        case 2: /* T */
            tile = new Tile(this.game, true, true, false, true);
            break;
        case 3:
            tile = new Tile(this.game, false, true, false, true);
            break;
        case 4:
            tile = new Tile(this.game, true, true, false, false);
            break;
        case 5:
            tile = new Tile(this.game, true, false, false, false);
            break;
    }
    tile.draw();

    tile.x = (this.tilesContainer.getChildAt(index).width - tile.width) / 2;
    tile.y = (this.tilesContainer.getChildAt(index).height - tile.height) / 2;

    tile.onClicked.add(this.selectTile, this);
    tile.index = index;

    this.tilesContainer.getChildAt(index).addChild(tile);
    return tile;
};

GAME.Main.prototype.newTurn = function(droppedTile) {
    /* Update dead ends */
    this.grid.updateWays(droppedTile.gridX, droppedTile.gridY);

    let index = this.selectedTile.index;

    this.selectedTile.destroy();

    this.createTile(index, this.layouts.shift());
    this.selectTile(this.tilesContainer.getChildAt(index).getChildAt(0));
};
