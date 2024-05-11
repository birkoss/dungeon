import Phaser from "../lib/phaser.js";

export class ToggleButton {
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.Image} */
    #background;
    /** @type {Phaser.GameObjects.Image} */
    #image;
    /** @type {number} */
    #imageOriginY;

    /** @type {any} */
    #value;

    /** @type {boolean} */
    #select;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} assetKey 
     * @param {any} [value]
     */
    constructor(scene, x, y, assetKey, value) {
        this.#value = value;
        this.#select = false;

        this.#container = scene.add.container(x, y);
        this.#background = scene.add.image(0, 0, assetKey, 1);
        this.#background.setOrigin(0);
        this.#container.add(this.#background);
    }

    /** @type {Phaser.GameObjects.Image} */
    get background() {
        return this.#background;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    /** @type {boolean} */
    get isSelected() {
        return this.#select;
    }

    /** @type {any} */
    get value() {
        return this.#value;
    }

    /**
     * @param {string} assetKey
     * @param {number} assetFrame
     */
    add(assetKey, assetFrame) {
        this.#image = this.#container.scene.add.image(0, 0, assetKey, assetFrame);
        this.#container.add(this.#image);
        this.#image.x = this.#background.width / 2;
        this.#image.y = (this.#background.height / 2) - 3;

        this.#imageOriginY = this.#image.y;
    }

    select() {
        this.#background.setFrame(1);
        this.#select = true;
        this.#image.y = this.#imageOriginY + 6;
    }

    unselect() {
        this.#background.setFrame(0);
        this.#select = false;
        this.#image.y = this.#imageOriginY;
    }
}
