import Phaser from "../lib/phaser.js";
import { TILE_ENTITY_TYPE, TileEntity } from "./tiles/entities/entity.js";
import { TILE_TYPE, Tile } from "./tiles/tile.js";

export class Dungeon {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;

    /** @type {DungeonTheme} */
    #theme;

    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Tile[]} */
    #tiles;

    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#createTiles();

        this.#container = this.#scene.add.container(0, 0);
    }

    get container() {
        return this.#container;
    }

    create(theme) {
        this.#theme = theme;

        this.#tiles.forEach((singleTile) => {
            let assetKey = theme.floor.assetKey;
            let assetFrame = theme.floor.assetFrames[0];
            
            if (singleTile.type === TILE_TYPE.BORDER) {
                assetKey = theme.border.assetKey;
                assetFrame = 0;
                // Get the first frame, should always be the default wall
                if (theme.border.assetFrames.length > 0) {
                    assetFrame = theme.border.assetFrames[0];
                }

                let dungeonWallLayout = this.#getTileLayout(singleTile.x, singleTile.y, TILE_TYPE.BORDER);
                if (dungeonWallLayout < theme.border.assetFrames.length) {
                    assetFrame = theme.border.assetFrames[dungeonWallLayout];
                }
            }

            let tileContainer = singleTile.create(this.#scene, assetKey, assetFrame);
            this.#container.add(tileContainer);
        });

        this.#validateTileShadows();
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    toggleAt(x, y) {
        let tile = this.#tiles.find(singleTile => singleTile.x === x && singleTile.y === y);

        if (tile.type === TILE_TYPE.BORDER) {
            return;
        }

        if (!tile.entity) {
            tile.createEntity(this.#scene, this.#theme.wall.assetKey, this.#theme.wall.assetFrame);
            tile.entity.scaleIn();
            this.#validateTileShadows();
            return;
        }

        if (tile.entity.type !== TILE_ENTITY_TYPE.WALL) {
            return;
        }

        this.#validateTileShadows(tile);
        tile.entity.scaleOut(() => {
            tile.removeEntity();
        });
    }

    #createTiles() {
        this.#tiles = [];

        for (let y=0; y<this.#height; y++) {
            for (let x=0; x<this.#width; x++) {
                let isBorder = (x === 0 || y === 0 || y === this.#height-1 || x === this.#width-1);

                let tile = new Tile(x, y, isBorder ? TILE_TYPE.BORDER : TILE_TYPE.FLOOR);
                this.#tiles.push(tile);
            }
        }
    }


    /**
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} [includeBorder=false] 
     * @returns {Tile[]}
     */
    #getNeighboors(x, y, includeBorder) {
        let neighboors = [];

        for (let y2=-1; y2<= 1; y2++) {
            for (let x2=-1; x2<= 1; x2++) {
                // Skip non-adjacent ?
                if (Math.abs(x2) == Math.abs(y2)) {
                    continue;
                }

                let neighboorX = x + x2;
                let neighboorY = y + y2;

                // Must be in bound
                if (!this.#isInBound(neighboorX, neighboorY)) {
                    continue;
                }

                let index = (neighboorY * this.#width) + neighboorX;

                // Skip border
                if (includeBorder && this.#tiles[index].type === TILE_TYPE.BORDER) {
                    continue;
                }

                neighboors.push(this.#tiles[index]);
            }
        }
        return neighboors;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {import("./tiles/tile.js").TileType} tileType 
     * @returns {number}
     */
    #getTileLayout(x, y, tileType) {
        // Get the layout depending on its neighboors from the tileType
        // - Depending on the adjacent tile from those values (0 to 15) :
        //  - (left = +1, top = +2, right = +4, bottom = +8)
        let layout = 0;

        let neighboors = this.#getNeighboors(x, y);
        neighboors.forEach((singleNeighboor) => {
            // Only check adjacent wall
            if (singleNeighboor.type !== tileType) {
                return;
            }

            let diffX = x - singleNeighboor.x;
            let diffY = y - singleNeighboor.y;
            if (diffX !== 0) {
                layout += (diffX < 0 ? 4 : 1);
            } else {
                layout += (diffY < 0 ? 8 : 2);
            }
        });

        return layout;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    #isInBound(x, y) {
        return (x >= 0 && x < this.#width && y >= 0 && y < this.#height);
    }

    /**
     * 
     * @param {Tile} [tileGoingAway] 
     */
    #validateTileShadows(tileGoingAway) {
        this.#tiles.forEach((singleTile) => {
            // Only FLOOR have shadow
            if (singleTile.type !== TILE_TYPE.FLOOR) {
                return;
            }

            let needShadow = false;

            let tileTopNeighboor = this.#tiles.find(singleTopTile => singleTopTile.x === singleTile.x && singleTopTile.y === singleTile.y - 1);
            // A shadow below a BORDER
            if (tileTopNeighboor.type === TILE_TYPE.BORDER) {
                needShadow = true;
            }

            // Need a shadow below a FLOOR with a WALL
            if (tileTopNeighboor.type === TILE_TYPE.FLOOR && tileTopNeighboor.entity && tileTopNeighboor.entity.type === TILE_ENTITY_TYPE.WALL && tileTopNeighboor !== tileGoingAway) {
                needShadow = true;
            }

            if (needShadow && !singleTile.shadow) {
                singleTile.createShadow(this.#scene, this.#theme.shadow.assetKey, this.#theme.shadow.assetFrame);
                singleTile.shadow.fadeIn(() => {

                }, 400);
                return;
            }
            if (!needShadow && singleTile.shadow) {
                singleTile.shadow.fadeOut(() => {
                    singleTile.removeShadow();
                }, 400);
            }
        });
    }
}