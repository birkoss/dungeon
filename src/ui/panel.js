import Phaser from "../lib/phaser.js";

import { PANEL_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class Panel {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.BitmapText} */
    #textFloor;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(scene, x, y) {
        this.#scene = scene;

        this.#container = this.#scene.add.container(x, y);

        const background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x000000);
        background.displayWidth = this.#scene.game.canvas.width ;
        background.displayHeight = 90;
        this.#container.add(background);

        this.#container.add(this.#scene.add.bitmapText(this.#scene.game.canvas.width/2, 30, PANEL_ASSET_KEYS.FONT, "Tower of Hakkan", 32).setTint(0xffffff).setOrigin(0.5));
        this.#textFloor = this.#scene.add.bitmapText(this.#scene.game.canvas.width/2, 60, PANEL_ASSET_KEYS.FONT, "Floor 0", 16).setTint(0xffffff).setOrigin(0.5);
        this.#container.add(this.#textFloor);
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * @param {number} floor 
     */
    updateFloorName(floor) {
        this.#textFloor.setText(`Floor ${floor}`);
    }
}