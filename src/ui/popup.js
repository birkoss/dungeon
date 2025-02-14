import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Popup {
    /** @type {Phaser.GameObjects.BitmapText} */
    #text;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {string} label
     * @param {number} color
     * @param {() => void} [callback]
     */
    constructor(scene, x, y, label, color, callback) {
        this.#text = scene.add.bitmapText(x, y, UI_ASSET_KEYS.FONT, label, 16).setTint(color).setOrigin(0.5);

        scene.add.tween({
            targets: this.#text,
            y: this.#text.y - 50,
            duration: 1000,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete: () => {
                scene.add.tween({
                    targets: this.#text,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        this.#text.destroy();

                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        });
    }

    get text() { return this.#text; }
}
