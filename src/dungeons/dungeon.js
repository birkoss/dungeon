import Phaser from "../lib/phaser.js";

import { DUNGEON_ASSET_KEYS } from "../keys/asset.js";
import { TILE_ENTITY_TYPE } from "./tiles/entities/entity.js";
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
    /** @type {Level} */
    #level;

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

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }
    /** @type {Tile[]} */
    get tiles() {
        return this.#tiles;
    }

    /**
     * @param {DungeonTheme} theme 
     * @param {Level} level 
     */
    create(theme, level) {
        this.#theme = theme;
        this.#level = level;

        let levelData = level.data.join("");

        // Create each tiles from the current theme
        this.#tiles.forEach((singleTile) => {
            let assetKey = theme.unknown.assetKey;
            let assetFrame = theme.unknown.assetFrame;
            
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

            singleTile.createShadow(this.#scene, theme.shadow.assetKey, theme.shadow.assetFrame);
            singleTile.shadow.gameObject.setAlpha(0);
        });

        let labelsTextX = new Array(this.#width-2).fill(0);
        let labelsTextY = new Array(this.#height-2).fill(0);

        // Create each enemy and chest from the current level
        for (let i=0; i<levelData.length; i++) {
            // BORDER are not accounted for in the level data (- 2 = Remove thoses 2 borders)
            let y = Math.floor(i / (this.#width - 2));
            let x = i - (y * (this.#width - 2));

            let data = levelData[i];
            if (data === "0") {
                continue;
            }

            // Get total for each WALL
            if (data === "1") {
                labelsTextX[x]++;
                labelsTextY[y]++;
                continue;
            }

            let tile = this.#tiles.find(singleTile => singleTile.x === x + 1 && singleTile.y === y + 1);

            if (data === "3") {
                tile.background.gameObject.setTexture(theme.floor.assetKey);
                tile.background.gameObject.setFrame(theme.floor.assetFrame);

                tile.createEntity(this.#scene, TILE_ENTITY_TYPE.CHEST, DUNGEON_ASSET_KEYS.WORLD, 196);
            } else if (data === "2") {
                tile.background.gameObject.setTexture(theme.floor.assetKey);
                tile.background.gameObject.setFrame(theme.floor.assetFrame);

                tile.createEntity(this.#scene, TILE_ENTITY_TYPE.BACKGROUND, DUNGEON_ASSET_KEYS.WORLD, 2017);

                let enemy = tile.createEntity(this.#scene, TILE_ENTITY_TYPE.ENEMY, DUNGEON_ASSET_KEYS.UNITS, [290, 308]);
                enemy.gameObject.y -= 8;
            }
        }
        
        // Show total
        this.#tiles.forEach(singleTile => {
            if (singleTile.type !== TILE_TYPE.BORDER) {
                return;
            }
            if (singleTile.x !== 0 && singleTile.y !== 0) {
                return;
            }
            
            if (singleTile.y === 0) {
                if (singleTile.x == 0 || singleTile.x == this.#width -1) {
                    return;
                }
                singleTile.createLabel(this.#scene, `${labelsTextX[singleTile.x - 1]}`);
                singleTile.validateLabel(0);
                return;
            }
            if (singleTile.x === 0) {
                if (singleTile.y == 0 || singleTile.y == this.#height -1) {
                    return;
                }
                singleTile.createLabel(this.#scene, `${labelsTextY[singleTile.y - 1]}`);
                singleTile.validateLabel(0);
            }
        });

        // Add shadows
        this.#tiles.forEach(singleTile => {
            this.#validateTileShadows(singleTile);
        });
    }

    /**
     * @returns {boolean}
     */
    isCompleted() {
        let levelSolution = this.#level.data.join("").replace(/(2|3)/g, '0');
        let levelData = new Array((this.#width - 2) * (this.#height - 2)).fill(0);

        this.#tiles.forEach(singleTile => {
            if (singleTile.entity && singleTile.entity.type === TILE_ENTITY_TYPE.WALL) {
                let index = ((singleTile.y - 1) * (this.#width - 2)) + (singleTile.x - 1);
                levelData[index] = "1";
            }
        });
       
        return levelData.join("") === levelSolution;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {TILE_ENTITY_TYPE} newType 
     * @param {boolean} isActive
     * @param {() => void} [callback]
     */
    toggleAt(x, y, newType, isActive, callback) {
        // Must be from within the map size (0, 0) -> (width - 1, height - 1)
        if (!this.#isInBound(x, y)) {
            return;
        }

        // Must be a valid tile
        let tile = this.#tiles.find(singleTile => singleTile.x === x && singleTile.y === y);
        if (!tile) {
            return;
        }

        // Must be a FLOOR
        if (tile.type !== TILE_TYPE.FLOOR) {
            return;
        }

        // Must NOT be a CHEST or ENEMY
        if (tile.entity && (tile.entity.type === TILE_ENTITY_TYPE.CHEST || tile.entity.type === TILE_ENTITY_TYPE.ENEMY)) {
            return;
        }

        // Pick the right asset key depending on the newType
        let newAssetKey = this.#theme.wall.assetKey;
        let newAssetFrame = this.#theme.wall.assetFrame;
        if (newType === TILE_ENTITY_TYPE.BACKGROUND) {
            newAssetKey = this.#theme.floor.assetKey;
            newAssetFrame = this.#theme.floor.assetFrame;
        }

        if (isActive) {
            // Do nothing if it's already active
            if (tile.entity && tile.entity.type === newType) {
                return;
            }
            
            // Keep the existing entity to remove it later
            let existingEntity = tile.entity;

            this.#validateTileShadows(tile, {
                created: true,
                newType: newType,
            });
            tile.createEntity(this.#scene, newType, newAssetKey, newAssetFrame);
            tile.entity.scaleIn(() => {
                if (existingEntity) {
                    existingEntity.gameObject.destroy();
                }
                this.#validateLabels(tile);

                if (callback) {
                    callback();
                }
            });
            return;
        }

        if (!isActive) {
            // Nothing to remove, do nothing
            if (!tile.entity) {
                return;
            }

            // Must be the same type
            if (tile.entity && tile.entity.type !== newType) {
                return;
            }

            this.#validateTileShadows(tile, {
                removed: true,
                newType: newType,
            });
            tile.entity.scaleOut(() => {
                tile.removeEntity();
                this.#validateLabels(tile);

                if (callback) {
                    callback();
                }
            });
            return;            
        }
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
     * @param {Tile} [tile] 
     * @param {object} [tilePending] 
     * @param {boolean} [tilePending.created]
     * @param {import("./tiles/entities/entity.js").TileEntityType} [tilePending.newType] 
     * @param {boolean} [tilePending.removed] 
     */
    #validateTileShadows(tile, tilePending) {
        // Get if the tile is a WALL or not
        let tileIsWall = (tile.type === TILE_TYPE.BORDER);
        if (tilePending?.created && tilePending?.newType === TILE_ENTITY_TYPE.WALL) {
            tileIsWall = true;
        } else if (tilePending?.removed) {
            tileIsWall = false;
        } else if (tile.entity && tile.entity.type === TILE_ENTITY_TYPE.WALL) {
            tileIsWall = true;
        }

        // Get if the top neighboor is a WALL or not
        let topTileIsWall = false;

        let topNeighboor = this.#tiles.find(singleTile => singleTile.x === tile.x && singleTile.y === tile.y - 1);
        if (topNeighboor) {
            if (topNeighboor.type === TILE_TYPE.BORDER) {
                topTileIsWall = true;
            } else if (topNeighboor.entity && topNeighboor.entity.type === TILE_ENTITY_TYPE.WALL) {
                topTileIsWall = true;
            }
        }

        // Get if the bottom neighboor is a WALL or not
        let bottomTileIsWall = false;

        let bottomNeighboor = this.#tiles.find(singleTile => singleTile.x === tile.x && singleTile.y === tile.y + 1);
        if (bottomNeighboor) {
            if (bottomNeighboor.type === TILE_TYPE.BORDER) {
                bottomTileIsWall = true;
            } else if (bottomNeighboor.entity && bottomNeighboor.entity.type === TILE_ENTITY_TYPE.WALL) {
                bottomTileIsWall = true;
            }
        }

        // Tile SHADOW
        if (!tileIsWall && topTileIsWall) {
            if (tile.shadow.gameObject.alpha === 0) {
                tile.shadow.fadeIn(() => {}, 400);
            }
        } else {
            if (tile.shadow.gameObject.alpha === 1) {
                tile.shadow.fadeOut(() => {}, 400);
            }
        }

        // Tile Under SHADOW
        if (bottomNeighboor) {
            if (tileIsWall && !bottomTileIsWall) {
                if (bottomNeighboor.shadow.gameObject.alpha === 0) {
                    bottomNeighboor.shadow.fadeIn(() => {}, 400);
                }
            } else {
                if (bottomNeighboor.shadow.gameObject.alpha === 1) {
                    bottomNeighboor.shadow.fadeOut(() => {}, 400);
                }
            }
        }
    }

    /**
     * @param {Tile} tile 
     */
    #validateLabels(tile) {
        let totalX = 0;
        for (let x=1; x<this.#width - 1; x++) {
            let t = this.#tiles.find(singleTile => singleTile.x === x && singleTile.y === tile.y);
            if (t.entity && t.entity.type === TILE_ENTITY_TYPE.WALL) {
                totalX++;
            }
        }

        this.#tiles.find(singleTile => singleTile.x === 0 && singleTile.y === tile.y).validateLabel(totalX);

        let totalY = 0;
        for (let y=1; y<this.#height - 1; y++) {
            let t = this.#tiles.find(singleTile => singleTile.x === tile.x && singleTile.y === y);
            if (t.entity && t.entity.type === TILE_ENTITY_TYPE.WALL) {
                totalY++;
            }
        }

        this.#tiles.find(singleTile => singleTile.x === tile.x && singleTile.y === 0).validateLabel(totalY);
    }
}
