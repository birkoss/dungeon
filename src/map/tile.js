export const TILE_SCALE = 4;

export const TILE_TYPE = Object.freeze({
    WALL: 'WALL',
    FLOOR: 'FLOOR',
});

export class Tile {
    /** @type {Phaser.Scene} */
    _scene;
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;
    /** @type {keyof typeof TILE_TYPE} */
    #type;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {keyof typeof TILE_TYPE} type
     */
    constructor(scene, x, y, type) {
        this._scene = scene;
        this.#x = x;
        this.#y = y;
        this.#type = type;

        this.#container = scene.add.container(0, 0);
    }

    get container() { return this.#container; }
    get type() { return this.#type; }
    get x() { return this.#x; }
    get y() { return this.#y; }

    /**
     * @param {string} assetKey
     * @param {number} frame
     * @param {number} [x=0]
     * @param {number} [y=0]
     */
    create(assetKey, frame, x = 0, y = 0) {
        const sprite = this._scene.add.sprite(x, y, assetKey, frame).setScale(TILE_SCALE).setOrigin(0.5);
        this.#container.add(sprite);
        
        return sprite;
    }
}
