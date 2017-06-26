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
    this.addTileAt(new Tile(this.game, false, true, true, true), 2, 4);
    this.addTileAt(new Tile(this.game, false, true, false, true), 4, 6);

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
                for (let b=single_direction.depth.from; b!=single_direction.depth.to; b += (single_direction.depth.from == 0 ? 1 : -1)) {
                    let gridX = a;
                    let gridY = b;
                    let arrowX = gridX, arrowY = single_direction.depth.from;
                    if (single_direction.main == 'y') {
                        gridX = b;
                        gridY = a;
                        arrowY = gridY;
                        arrowX = single_direction.depth.from;
                    }
                    if (this.cells[gridY][gridX] != null) {
                        if (this.cells[gridY][gridX].ways[single_direction.arrowWay]) {
                            arrows.push({gridX:arrowX, gridY:arrowY, way:single_direction.arrowWay});
                        }
                        break;
                    }
                }
            }
        }
    }, this);

    console.log(arrows);

    let angles = {'Up':0, 'Down':180, 'Left':270, 'Right':90};

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
