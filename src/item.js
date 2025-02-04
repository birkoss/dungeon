import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";
import { TILE_SCALE } from "./tile.js";

export const ITEM_TYPE = Object.freeze({
    EXIT: 'EXIT',
    COIN: 'COIN',
    POTION: 'POTION',
});

export class Item {
    #x;
    #y;
    #scene;
    #type;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    #gameObject;

    constructor(scene, x, y, type) {
        this.#scene = scene;
        this.#x = x;
        this.#y = y;
        this.#type = type;

        let frame = 0;
        if (this.#type === ITEM_TYPE.EXIT) {
            frame = 3;
        } else if (this.#type === ITEM_TYPE.COIN) {
            frame = 54;
        } else if (this.#type === ITEM_TYPE.POTION) {
            frame = 37;
        }

        this.#gameObject = scene.add.sprite(x * 10 * TILE_SCALE, y * 10 * TILE_SCALE, DUNGEON_ASSET_KEYS.WORLD, frame).setScale(TILE_SCALE).setOrigin(0.5);
    }

    get gameObject() { return this.#gameObject; }
    get type() { return this.#type; }
    get x() { return this.#x; }
    get y() { return this.#y; }
}
