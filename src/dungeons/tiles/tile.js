import Phaser from "../../lib/phaser.js";

import { TILE_SIZE } from "../../config.js";
import { TILE_ENTITY_TYPE, TileEntity } from "./entities/entity.js";

/** @typedef {keyof typeof TILE_TYPE} TileType */
/** @enum {TileType} */
export const TILE_TYPE = Object.freeze({
    BORDER: 'BORDER',
    FLOOR: 'FLOOR',
});

export class Tile {
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;
    /** @type {TileType} */
    #type;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {TileEntity} */
    #background;
    /** @type {TileEntity} */
    #entity;
    /** @type {TileEntity} */
    #shadow;

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {TileType} type 
     */
    constructor(x, y, type) {
        this.#x = x;
        this.#y = y;
        this.#type = type;
    }

    /** @type {number} */
    get x() {
        return this.#x;
    }
    /** @type {number} */
    get y() {
        return this.#y;
    }
    /** @type {TileType} */
    get type() {
        return this.#type;
    }
    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    /** @type {TileEntity} */
    get background() {
        return this.#background;
    }
    /** @type {TileEntity} */
    get entity() {
        return this.#entity;
    }
    /** @type {TileEntity} */
    get shadow() {
        return this.#shadow;
    }

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} [assetKey='']
     * @param {number} [assetFrame=0]
     * @returns {Phaser.GameObjects.Container}
     */
    create(scene, assetKey, assetFrame) {
        this.#container = scene.add.container(this.x * TILE_SIZE, this.y * TILE_SIZE);

        // Create the tile background (border or floor)
        this.#background = new TileEntity(TILE_ENTITY_TYPE.BACKGROUND);
        this.#background.create(scene, assetKey, assetFrame);
        this.#container.add(this.#background.gameObject);

        return this.#container;
    }

    createEntity(scene, type, assetKey, assetFrame) {
        this.#entity = new TileEntity(type);
        this.#entity.create(scene, assetKey, assetFrame);
        this.#container.add(this.#entity.gameObject);

        return this.#container;
    }
    removeEntity() {
        this.#entity.gameObject.destroy();
        this.#entity = undefined;
    }

    createShadow(scene, assetKey, assetFrame) {
        this.#shadow = new TileEntity(TILE_ENTITY_TYPE.WALL);
        this.#shadow.create(scene, assetKey, assetFrame);
        this.#container.add(this.#shadow.gameObject);

        if (this.#entity) {
            this.#container.moveAbove(this.#entity.gameObject, this.#shadow.gameObject);
        }

        return this.#container;
    }
    removeShadow() {
        this.#shadow.gameObject.destroy();
        this.#shadow = undefined;
    }
}
