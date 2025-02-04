import { Item } from "./item.js";
import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";
import { Pathfinding } from "./pathfinding.js";
import { Tile, TILE_TYPE } from "./tile.js";

export class Map {
    /** @type {Phaser.GameObjects.Container} */
    #container;
    #scene;

    #tiles;
    #width;
    #height;

    #units;
    /** @type {Item[]} */
    #items;

    constructor(scene, width, height) {
        this.#units = [];
        this.#items = [];

        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#container = this.#scene.add.container(0, 0);

        this.#tiles = [];
    }

    get container() { return this.#container; }
    get items() { return this.#items; }
    get units() { return this.#units; }
    get width() { return this.#width; }

    addUnit(unit) {
        this.#container.add(unit.gameObject);
        this.#units.push(unit);
    }

    addItem(item) {
        this.#container.add(item.gameObject);
        this.#items.push(item);
    }

    fill(floor, total) {
        const tiles = [];

        for (let i=0; i<floor/5; i++) {
            tiles.push('coin');
        }

        for (let i=0; i<floor-1; i++) {
            tiles.push('enemy');
        }

        Phaser.Utils.Array.Shuffle(tiles);

        if (floor % 5 === 0) {
            tiles.unshift('potion');
        }

        const amount = Math.min(floor < 4 ? floor : 3 + floor / 4, total / 4.5);
        return tiles.slice(0, amount);
    }

    findPaths(start, end, tiles) {
        let grid = [];
        this.#tiles.forEach(singleTile => {
            grid.push(singleTile.type === TILE_TYPE.FLOOR ? 0 : 1);
        });

        this.items.forEach(item => {
            grid[item.y * this.#width + item.x] = 1;
        });

        tiles.forEach(tile => { 
            grid[tile.y * this.#width + tile.x] = 1;
        });

        let pathfinding = new Pathfinding(grid, this.#width, this.#height);
        return pathfinding.find(start, end);
    }

    fixDepth(unit, x, y) {
        this.#units.forEach(singleUnit => {
            if (!singleUnit.isAlive && singleUnit.x === x && singleUnit.y === y) {
                this.#container.moveAbove(unit.gameObject, singleUnit.gameObject);
            }
        });
        this.#items.forEach(singleItem => {
            if (singleItem.x === x && singleItem.y === y) {
                this.#container.moveAbove(unit.gameObject, singleItem.gameObject);
            }
        });
    }

    generate() {
        this.#tiles.forEach(singleTile => {
            singleTile.container.destroy();
        });
        this.#tiles = [];

        this.#items.forEach(singleItem => {
            singleItem.gameObject.destroy();
        });
        this.#items = [];

        this.#units.forEach(singleUnit => {
            singleUnit.gameObject.destroy();
        });
        this.#units = [];

        let walls = [
            [3, 2],
            [3, 3],
            [4, 2],
            [4, 3],
            [3, 6],
            [3, 7],
            [4, 6],
            [4, 7],
        ];

        let type;
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {  
                type = TILE_TYPE.WALL;

                if (x > 0 && x < 7 && y > 0 && y < 9) {
                    type = TILE_TYPE.FLOOR;
                }

                for (let wall of walls) {
                    if (x == wall[0] && y == wall[1]) {
                        type = TILE_TYPE.WALL;
                    }
                }

                let tile = new Tile(this.#scene, x, y, type);
                this.#container.add(tile.container);
                this.#tiles.push(tile);

                tile.createBackground(this.#scene);
                
                if (type === TILE_TYPE.FLOOR) {
                    let needShadow = false;

                    // Top tile of a floor is a wall
                    if (y > 0 && this.#tiles[(y - 1) * this.#width + x].type === TILE_TYPE.WALL) {
                        needShadow = true;
                    }

                    if (needShadow) {
                        tile.createShadow(this.#scene);
                    }
                }
            }
        }
    }

    getEmptyTiles() {
        return this.#tiles.filter(singleTile => singleTile.type === TILE_TYPE.FLOOR);
    }

    isInBound(x, y) {
        return x >= 0 && x < this.#width && y >= 0 && y < this.#height;
    }

    isWalkable(x, y) {
        if (!this.isInBound(x, y)) {
            return false;
        }

        let isWalkable = this.#tiles[y * this.#width + x].type === TILE_TYPE.FLOOR;

        this.units.forEach(unit => {
            if (unit.isAlive && unit.x === x && unit.y === y) {
                isWalkable = false;
            }
        });
        return isWalkable;
    }

    isAttackable(x, y) {
        if (!this.isInBound(x, y)) {
            return false;
        }

        let isAttackable = false;

        this.units.forEach((singleUnit, index) => {
            if (index > 0 && singleUnit.isAlive && singleUnit.x === x && singleUnit.y === y) {
                isAttackable = true;
            }
        });
      
        return isAttackable;
    }

    useItemAt(x, y) {
        let item = this.items.find(singleItem => singleItem.x === x && singleItem.y === y);
        item.gameObject.destroy();

        const index = this.#items.indexOf(item);
        if (index > -1) {
            this.#items.splice(index, 1);
        }
    }
}