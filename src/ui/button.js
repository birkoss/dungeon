import Phaser from "../lib/phaser.js";

export class Button {
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.Image} */
    #background;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} assetKey 
     * @param {number} assetFrame
     * @param {() => void} [callback]
     */
    constructor(scene, assetKey, assetFrame, callback) {
        this.#container = scene.add.container(0, 0);

        this.#background = scene.add.image(0, 0, assetKey, assetFrame);
        this.#background.setOrigin(0);
        this.#container.add(this.#background);

        this.#background.setInteractive();
        this.#background.on(Phaser.Input.Events.POINTER_DOWN, callback);
    }

    /** @type {Phaser.GameObjects.Image} */
    get background() {
        return this.#background;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() {
        return this.#container;
    }

    /**
     * @param {Phaser.GameObjects.Text} gameObject
     */
    add(gameObject) {
        this.#container.add(gameObject);
        gameObject.setOrigin(0.5);
        gameObject.x = (this.#background.width / 2) + 2;
        gameObject.y = (this.#background.height / 2) - 3;
    }
}
