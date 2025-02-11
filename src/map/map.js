import { Entity } from "../entity/entity.js";
import { Unit } from "../entity/unit.js";
import { MAP_ASSET_KEYS } from "../keys/asset.js";
import { Animation } from "../utils/animation.js";
import { Tile, TILE_TYPE } from "./tile.js";

const TILE_SCALE = 4;

export class Map {
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;

    /** @type {Entity[]} */
    #entities;
    /** @type {Unit[]} */
    #units;
    /** @type {Tile[]} */
    #tiles;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;

        this.#container = this.#scene.add.container(0, 0);

        this.#entities = [];
        this.#units = [];
        this.#tiles = [];

        let water = [
            [0, 6],
            [1, 6],
            [2, 6],
        ];

        let type;
        let frame = 93;

        for (let y=0; y<this.#height; y++) {
            for (let x=0; x<this.#width; x++) {
                frame = 93;
                type = TILE_TYPE.FLOOR;
                
                if (y === 0 || y === this.#height-1 || x === 0 || x === this.#width-1) {
                    type = TILE_TYPE.WALL;
                    frame = 85;
                }
                let tile = new Tile(this.#scene, x, y, TILE_TYPE.FLOOR);
                tile.create(MAP_ASSET_KEYS.WORLD, frame);

                tile.container.x = tile.x * tile.container.getBounds().width;
                tile.container.y = tile.y * tile.container.getBounds().height;

                tile.container.x += tile.container.getBounds().width/2;
                tile.container.y += tile.container.getBounds().height/2;

                this.#container.add(tile.container);

                if (frame === 102) {
                    // Animation.generate(img, 'idle', MAP_ASSET_KEYS.WORLD, [102, 103]);
                    // img.anims.play('idle');

                    // const shadow = this.#scene.add.image(img.x, img.y, MAP_ASSET_KEYS.WORLD, 100).setScale(TILE_SCALE);
                    // this.#container.add(shadow);
                }
            }
        }
    }

    get container() { return this.#container; }

    addEntity(entity) {
        this.#entities.push(entity);
        this.#placeEntity(entity);
    }

    addUnit(unit) {
        this.#units.push(unit);
        this.#placeEntity(unit);

    }

    #placeEntity(entity) {
        this.#container.add(entity.container);
        entity.container.x = entity.x * entity.container.getBounds().width + entity.container.getBounds().width/2;
        entity.container.y = entity.y * entity.container.getBounds().height + entity.container.getBounds().height/2;
    }
}
