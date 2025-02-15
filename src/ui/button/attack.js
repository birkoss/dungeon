import Phaser from "../../lib/phaser.js";

import { UI_ASSET_KEYS } from "../../keys/asset.js";
import { Button } from "../button.js";

export class AttackButton extends Button {
    #callback;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} label
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, label, onClickCallback) {
        super(scene);

        this.#callback = onClickCallback;

        const background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xbb7f20);
        background.displayWidth = this._scene.game.canvas.width - 76;
        background.displayHeight = 60;
        this._container.add(background);

        const text = this._scene.add.bitmapText(0, -4, UI_ASSET_KEYS.FONT, label, 32).setTint(0x6a3404).setOrigin(0.5);
        this._container.add(text);

        this.enableInteraction(() => {
            background.setTint(0xe2a94d);
        }, () => {
            background.setTint(0xe09624);
        }, () => {
            if (this.#callback) {
                this.#callback();
            }
        });
    }

    get callback() { return this.#callback; }

    /**
     * @param {() => void} callback
     */
    set callback(callback) {
        this.#callback = callback;
    }
}
