import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";

export class Item {
    #x;
    #y;
    #scene;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    #gameObject;

    constructor(scene, x, y, frame) {
        const scale = 4;

        this.#scene = scene;
        this.#x = x;
        this.#y = y;

        this.#gameObject = scene.add.sprite(x * 10 * scale, y * 10 * scale, DUNGEON_ASSET_KEYS.WORLD, frame).setScale(scale).setOrigin(0.5);
    }

    get gameObject() { return this.#gameObject; }
    get x() { return this.#x; }
    get y() { return this.#y; }
}
