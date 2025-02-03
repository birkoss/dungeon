import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";

export class Map {
    /** @type {Phaser.GameObjects.Container} */
    #container;
    #scene;

    #tiles;
    #width;
    #height;

    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#container = this.#scene.add.container(0, 0);

        const scale = 4;

        this.#tiles = [];

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

        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {  
                let type = 1;

                let sprite = 0;

                if (x > 0 && x < 7 && y > 0 && y < 9) {
                    sprite = 20;
                    type = 0;
                }

                for (let wall of walls) {
                    if (x == wall[0] && y == wall[1]) {
                        sprite = 0;
                        type = 1;
                    }
                }

                this.#tiles.push(type);

                const tile = this.#scene.add.image(x * 10 * scale, y * 10 * scale, DUNGEON_ASSET_KEYS.WORLD, sprite).setScale(scale);
                this.#container.add(tile);
                

                if (type === 0) {
                    let needShadow = false;

                    // Top tile of a floor is a wall
                    if (y > 0 && this.#tiles[(y - 1) * this.#width + x] === 1) {
                        needShadow = true;
                    }

                    if (needShadow) {
                        const shadow = this.#scene.add.image(x * 10 * scale, y * 10 * scale, DUNGEON_ASSET_KEYS.WORLD, 21).setScale(scale);
                        this.#container.add(shadow);
                    }
                }
            }
        }
    }

    get container() { return this.#container; }

    addUnit(unit) {
        this.#container.add(unit.gameObject);
    }

    isInBound(x, y) {
        return x >= 0 && x < this.#width && y >= 0 && y < this.#height;
    }

    isWalkable(x, y) {
        return this.#tiles[y * this.#width + x] === 0;
    }
}