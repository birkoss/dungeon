import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Button {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    #callback;

    /** @type {Boolean} */
    #selected;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} label
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, label, onClickCallback) {
        this.#scene = scene;
        this.#callback = onClickCallback;

        this.#container = this.#scene.add.container(0, 0);

        this.#selected = false;

        const background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xbb7f20);
        background.displayWidth = this.#scene.game.canvas.width - 76;
        background.displayHeight = 60;
        this.#container.add(background);

        background.setInteractive();
        background.on('pointerdown', () => {
            background.setTint(0xe09624);
            this.#selected = true;
        });

        background.on('pointerup', () => {
            if (!this.#selected) {
                return;
            }

            this.#selected = false;
            if (this.#callback) {
                this.#callback();
            }
        });

        this.#scene.input.on('pointerup', (target) => {
            background.setTint(0xbb7f20);
            this.#selected = false;
        });

        const text = this.#scene.add.bitmapText(0, -4, UI_ASSET_KEYS.FONT, label, 32).setTint(0x6a3404).setOrigin(0.5);
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
