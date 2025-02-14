import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Button {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    #callback;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} label
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, label, onClickCallback) {
        this.#scene = scene;
        this.#callback = onClickCallback;

        this.#container = this.#scene.add.container(0, 0);

        const background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xff00ff);
        background.displayWidth = this.#scene.game.canvas.width - 60 ;
        background.displayHeight = 60;
        this.#container.add(background);

        background.setInteractive();
        background.on('pointerdown', () => {
            if (this.#callback) {
                this.#callback();
            }
        });

        const text = this.#scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT, label, 32).setTint(0xfff2e8).setOrigin(0.5);
        this.#container.add(text);
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }
    get callback() { return this.#callback; }

    /**
     * @param {() => void} callback
     */
    set callback(callback) {
        this.#callback = callback;
    }
}
