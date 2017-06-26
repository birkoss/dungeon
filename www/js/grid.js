function Grid(game, gridWidth, gridHeight) {
    Phaser.Group.call(this, game);

    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.cellsContainer = this.game.add.group();
    this.addChild(this.cellsContainer);

    this.arrowsContainer = this.game.add.group();
    this.addChild(this.arrowsContainer);

    this.onTileDropped = new Phaser.Signal();

    this.cells = [];

    for (gridY=0; gridY<gridHeight; gridY++) {
        let rows = [];
        for (gridX=0; gridX<gridWidth; gridX++) {
            let image = this.backgroundContainer.create(0, 0, "tile:dungeon");
            image.x = gridX * (image.width+1);
            image.alpha = 0.5;
            image.y = gridY * (image.height+1);

            rows.push(null);
        }
        this.cells.push(rows);
    }

    this.addTileAt(new Tile(this.game, true, true, true, true), 4, 4);

    this.selectedTile = null;
};

Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.addTileAt = function(tile, gridX, gridY) {
    tile.draw();
    tile.x = gridX * (tile.width+1);
    tile.y = gridY * (tile.height+1);
    this.cells[gridY][gridX] = tile;
};

Grid.prototype.showArrows = function(cell) {
    console.log("ShowArrows");
    this.selectedTile = cell;
    console.log(this.selectedTile);

    this.arrowsContainer.removeAll(true);

    let arrows = [];

    let directions = [
        {
            cellWay: 'Down',
            direction: {from:0, to:this.gridWidth},
            depth: {from:0, to:this.gridHeight},
            main: 'x',
            arrowWay: 'Up'
        },
        {
            cellWay: 'Up',
            direction: {from:0, to:this.gridWidth},
            depth: {from:this.gridHeight-1, to:0},
            main: 'x',
            arrowWay: 'Down'
        },
        {
            cellWay: 'Right',
            direction: {from:0, to:this.gridHeight},
            depth: {from:0, to:this.gridWidth},
            main: 'y',
            arrowWay: 'Left'
        },
        {
            cellWay: 'Left',
            direction: {from:0, to:this.gridHeight},
            depth: {from:this.gridWidth-1, to:0},
            main: 'y',
            arrowWay: 'Right'
        }
    ];

    directions.forEach(function(single_direction) {
        if (cell.ways[single_direction.cellWay]) {
            for (let a=single_direction.direction.from; a!=single_direction.direction.to; a += (single_direction.direction.from == 0 ? 1 : -1)) {
                let mod = (single_direction.depth.from == 0 ? 1 : -1);
                for (let b=single_direction.depth.from; b!=single_direction.depth.to; b += mod) {
                    let gridX=a, gridY=b;
                    let arrowX=gridX, arrowY=single_direction.depth.from;
                    let modifier = {x:0, y:0}
                    if (single_direction.main == 'y') {
                        gridX = b;
                        gridY = a;
                        arrowY = gridY;
                        arrowX = single_direction.depth.from;
                    }
                    
                    modifier[single_direction.main == 'y' ? 'x' : 'y'] = (single_direction.depth.from == 0 ? -1 : 1);

                    if (this.cells[gridY][gridX] != null) {
                        if (this.cells[gridY][gridX].ways[single_direction.arrowWay]) {
                            /* Be sure the next empty spot is not the border (where the arrow is) */
                            if (arrowX != gridX + modifier.x || arrowY != gridY + modifier.y) {
                                arrows.push({
                                    arrowX:arrowX, arrowY:arrowY, 
                                    gridX:gridX + modifier.x, gridY:gridY + modifier.y,
                                    way:single_direction.arrowWay
                                });
                            }
                        }
                        break;
                    }
                }
            }
        }
    }, this);

    let angles = {'Up':0, 'Down':180, 'Left':270, 'Right':90};

    arrows.forEach(function(arrow) {
        let image = this.arrowsContainer.create(0, 0, "tile:arrow");
        image.x = arrow.arrowX * (image.width+1)
        image.y = arrow.arrowY * (image.height+1);

        image.anchor.set(0.5);
        image.x += image.width/2;
        image.y += image.height/2;

        image.arrowX = arrow.arrowX;
        image.arrowY = arrow.arrowY;

        image.destinationX = arrow.gridX;
        image.destinationY = arrow.gridY;

        image.angle = angles[arrow.way];

        image.inputEnabled = true;
        image.events.onInputDown.add(this.dropTile, this);
    }, this);
};

Grid.prototype.dropTile = function(arrow, pointer) {
    console.log('Grid.dropTile');
    console.log(this.selectedTile);
    let tile = new Tile(this.game);
    this.cellsContainer.addChild(tile);
    tile.ways = this.selectedTile.ways;
    tile.draw();

    tile.x = arrow.x;
    tile.y = arrow.y;

    console.log("DROP AT: " + arrow.destinationX + "x" + arrow.destinationY);

    tile.x -= tile.width/2;
    tile.y -= tile.height/2;

    this.cells[arrow.destinationY][arrow.destinationX] = tile;

    let tween;
    if (arrow.destinationX == arrow.arrowX) {
        tween = this.game.add.tween(tile).to({y:arrow.destinationY * (tile.height+1)}, 100);
    } else {
        tween = this.game.add.tween(tile).to({x:arrow.destinationX * (tile.width+1)}, 100);
    }

    tween.onComplete.add(this.tileDropped, this);

    tween.start();

    this.arrowsContainer.removeAll(true);
};

Grid.prototype.tileDropped = function() {
    let droppedTile = this.selectedTile;
    this.selectedTile = null;
    this.onTileDropped.dispatch(droppedTile);
};
