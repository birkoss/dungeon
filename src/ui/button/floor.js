import Phaser from "../../lib/phaser.js";

import { UI_ASSET_KEYS } from "../../keys/asset.js";
import { Popup } from "../popup.js";
import { Button } from "../button.js";

export class FloorButton extends Button {
    /** @type {string} */
    #label;
    /** @type {boolean} */
    #isLocked;
    /** @type {() => void} */
    #callback;

    /** @type {Phaser.GameObjects.BitmapText} */
    #text;
    
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} label
     * @param {boolean} isLocked
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, label, isLocked, onClickCallback) {
        super(scene);

        this.#label = label;
        this.#isLocked = isLocked;
        this.#callback = onClickCallback;

        const filling = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x4e1906);
        this._container.add(filling);
        const background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BUTTON_FLOOR).setOrigin(0.5).setTint(0xe09624).setScale(4);
        filling.displayWidth = background.displayWidth;
        filling.displayHeight = background.displayHeight;
        this._container.add(background);

        this.#text = this._scene.add.bitmapText(0, background.displayHeight/2 - 1, UI_ASSET_KEYS.FONT, (this.#isLocked ? "LOCKED" : label), 32).setTint(0xfff2e8).setOrigin(0.5, 1);
        this._container.add(this.#text);

        this.enableInteraction(() => {
            background.setTint(0xe2a94d);
        }, () => {
            background.setTint(0xe09624);
        }, () => {
            if (this.#isLocked) {
                this.hide(() => {
                    const popup = new Popup(
                        this._scene,
                        this._container.x + this._container.parentContainer.x,
                        this._container.y + this._container.parentContainer.y,
                        "- 10 $",
                        0xeb8932,
                        () => {
                            this.#text.setText(this.#label);
                            this.#isLocked = false;
                            this.show();
                        }
                    );
                    popup.text.setScale(2);
                });
            } else if (this.#callback) {
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
