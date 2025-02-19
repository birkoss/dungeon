export const TILE_SCALE = 4;

export const ENTITY_TYPE = Object.freeze({
    UNIT: 'UNIT',
    DECORATION: 'DECORATION',
    SMALL_DECORATION: 'SMALL_DECORATION',
});

export class Entity {
    /** @type {Phaser.Scene} */
    _scene;
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;
    /** @type {keyof typeof ENTITY_TYPE} */
    #type;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {keyof typeof ENTITY_TYPE} type
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
        if (this.#type === ENTITY_TYPE.SMALL_DECORATION) {
            const shadow = this._scene.add.sprite(x, y, assetKey, 101).setScale(TILE_SCALE).setOrigin(0.5);
            this.#container.add(shadow);
        }

        const sprite = this._scene.add.sprite(x, y, assetKey, frame).setScale(TILE_SCALE).setOrigin(0.5);
        this.#container.add(sprite);
        
        return sprite;
    }
}
