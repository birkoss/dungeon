import Phaser from "../../lib/phaser.js";

import { UI_ASSET_KEYS } from "../../keys/asset.js";
import { Popup } from "../popup.js";

export class FloorButton {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {string} */
    #label;
    /** @type {boolean} */
    #isLocked;
    /** @type {() => void} */
    #callback;

    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.BitmapText} */
    #text;
    /** @type {boolean} */
    #selected;
    
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} label
     * @param {() => void} [onClickCallback]
     */
    constructor(scene, label, isLocked, onClickCallback) {
        this.#scene = scene;
        this.#label = label;
        this.#isLocked = isLocked;
        this.#callback = onClickCallback;

        this.#selected = false;

        this.#container = this.#scene.add.container(0, 0);

        const filling = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x4e1906);
        this.#container.add(filling);
        const background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BUTTON_FLOOR).setOrigin(0.5).setTint(0xe09624).setScale(4);        
        filling.displayWidth = background.displayWidth;
        filling.displayHeight = background.displayHeight;
        this.#container.add(background);

        this.#scene.input.on('pointerup', (target) => {
            background.setTint(0xe09624);
            this.#selected = false;
        });

        background.setInteractive();
        background.on('pointerdown', () => {
            background.setTint(0xe2a94d);
            this.#selected = true;
        });
        background.on('pointerup', () => {
            if (!this.#selected) {
                return;
            }

            this.#selected = false;

            if (this.#isLocked) {
                this.hide(() => {
                    console.log(this.container.x, this.container.y);
                    const popup = new Popup(
                        this.#scene,
                        this.#container.x + this.#container.parentContainer.x,
                        this.#container.y + this.#container.parentContainer.y,
                        "- 10 $",
                        0xeb8932,
                        () => {
                            this.#text.setText(this.#label);
                            this.#isLocked = false;
                            this.show();
                        }
                    );
                    popup.text.setScale(2);
                    // this.#container.add(popup.text);
                });
            } else if (this.#callback) {
                this.#callback();
            }
        });

        this.#text = this.#scene.add.bitmapText(0, background.displayHeight/2 - 1, UI_ASSET_KEYS.FONT, (this.#isLocked ? "LOCKED" : label), 32).setTint(0xfff2e8).setOrigin(0.5, 1);
        this.#container.add(this.#text);
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this.#scene.add.tween({
            targets: this.#container,
            alpha: 0,
            duration: 200,
            onComplete: callback,
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    show(callback) {
        this.#scene.add.tween({
            targets: this.#container,
            alpha: 1,
            duration: 200,
            onComplete: callback,
        });
    }
}
