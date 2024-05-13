import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Panel {
    /**
     * @param {Phaser.Scene} scene
     * @param {string} title 
     */
    constructor(scene, title) {
        scene.add.rectangle(0, 0, scene.scale.width, 79, 0x4d4d4d).setOrigin(0);
        scene.add.rectangle(0, 79, scene.scale.width, 6, 0x2c2c2c).setOrigin(0);

        scene.add.bitmapText(scene.scale.width / 2, 38, UI_ASSET_KEYS.LARGE_FONT, title, 36).setOrigin(0.5);
    }
}
