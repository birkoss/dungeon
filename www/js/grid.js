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
    this.arrowsContainer.removeAll(true);

    let arrows = [];

    if (cell.ways.Down) {
        for (gridX=0; gridX<this.gridWidth; gridX++) {
            /* Going down */
            for (gridY=0; gridY<this.gridHeight; gridY++) {
                if (this.cells[gridY][gridX] != null) {
                    if (this.cells[gridY][gridX].ways.Up) {
                        arrows.push({gridX:gridX, gridY:0, way:'Down'});
                    }
                    break;
                }
            }
        }
    }

    if (cell.ways.Up) {
        for (gridX=0; gridX<this.gridWidth; gridX++) {
            /* Going up */
            for (gridY=this.gridHeight-1; gridY>=0; gridY--) {
                if (this.cells[gridY][gridX] != null) {
                    if (this.cells[gridY][gridX].ways.Down) {
                        arrows.push({gridX:gridX, gridY:this.gridHeight-1, way:'Up'});
                    }
                    break;
                }
            }
        }
    }

    if (cell.ways.Right) {
        for (gridY=0; gridY<this.gridHeight; gridY++) {
            /* Going right */
            for (gridX=0; gridX<this.gridWidth; gridX++) {
                if (this.cells[gridY][gridX] != null) {
                    if (this.cells[gridY][gridX].ways.Left) {
                        arrows.push({gridX:0, gridY:gridY, way:'Left'});
                    }
                    break;
                }
            }
        }
    }

    if (cell.ways.Left) {
        for (gridY=0; gridY<this.gridHeight; gridY++) {
            /* Going left  */
            for (gridX=this.gridWidth-1; gridX>=0; gridX--) {
                if (this.cells[gridY][gridX] != null) {
                    if (this.cells[gridY][gridX].ways.Left) {
                        arrows.push({gridX:this.gridWidth-1, gridY:gridY, way:'Right'});
                    }
                    break;
                }
            }
        }
    }

    let angles = {'Up':180, 'Down':0, 'Left':270, 'Right':90};

    arrows.forEach(function(arrow) {
        let image = this.arrowsContainer.create(0, 0, "tile:arrow");
        image.x = arrow.gridX * (image.width+1)
        image.y = arrow.gridY * (image.height+1);

        image.anchor.set(0.5);
        image.x += image.width/2;
        image.y += image.height/2;

        image.angle = angles[arrow.way];
    }, this);

};
