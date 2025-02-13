import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Popup {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {string} label
     * @param {number} color
     */
    constructor(scene, x, y, label, color) {
        const text = scene.add.bitmapText(x, y, UI_ASSET_KEYS.FONT, label, 16).setTint(color).setOrigin(0.5);

        scene.add.tween({
            targets: text,
            y: text.y - 50,
            duration: 1000,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete: () => {
                scene.add.tween({
                    targets: text,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        text.destroy();
                    }
                });
            }
        });
    }
}
