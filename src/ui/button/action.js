import Phaser from "../../lib/phaser.js";

import { MAP_ASSET_KEYS, UI_ASSET_KEYS } from "../../keys/asset.js";
import { Button } from "../button.js";

export class ActionButton extends Button {
    #callback;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} iconFrame
     * @param {string} label
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, iconFrame, label, description, onClickCallback) {
        super(scene);

        this.#callback = onClickCallback;

        const filling = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x4e1906);
        this._container.add(filling);
        const background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BUTTON_ACTION).setOrigin(0.5).setTint(0xbb7f20).setScale(4);
        this._container.add(background);

        filling.displayWidth = background.displayWidth;
        filling.displayHeight = background.displayHeight;

        let text = this._scene.add.bitmapText(-97, -28, UI_ASSET_KEYS.FONT6, label, 12).setTint(0x6a3404).setOrigin(0);
        this._container.add(text);

        text = this._scene.add.bitmapText(-97, 0, UI_ASSET_KEYS.FONT6, description, 6).setTint(0x6a3404).setOrigin(0).setAlpha(0.5);
        text.setMaxWidth(250);
        text.setLineSpacing(5);
        this._container.add(text);

        const icon = this._scene.add.image(-background.displayWidth/2 + 30, 0, MAP_ASSET_KEYS.WORLD, iconFrame).setOrigin(0.5).setScale(4);
        this._container.add(icon);

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
