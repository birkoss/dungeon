import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";

export const TILE_TYPE = Object.freeze({
    WALL: 'WALL',
    FLOOR: 'FLOOR',
});

export const TILE_SCALE = 4;

export class Tile {
    #x;
    #y;
    /** @type {keyof typeof TILE_TYPE} */
    #type;

    #container;

    constructor(scene, x, y, type) {
        this.#x = x;
        this.#y = y;
        this.#type = type;

        this.#container = scene.add.container(x * 10 * TILE_SCALE, y * 10 * TILE_SCALE);
    }

    get container() { return this.#container; }
    get type() { return this.#type; }
    get x() { return this.#x; }
    get y() { return this.#y; }

    createBackground(scene) {
        const sprite = scene.add.image(0, 0, DUNGEON_ASSET_KEYS.WORLD, this.#type === TILE_TYPE.WALL ? 0 : 20).setScale(TILE_SCALE);
        this.#container.add(sprite);
    }

    createShadow(scene) {
        const shadow = scene.add.image(0, 0, DUNGEON_ASSET_KEYS.WORLD, 21).setScale(TILE_SCALE);
        this.#container.add(shadow);
    }
}