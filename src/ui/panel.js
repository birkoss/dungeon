import Phaser from "../lib/phaser.js";

import { DUNGEON_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class Panel {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.BitmapText} */
    #textFloor;
    /** @type {Phaser.GameObjects.BitmapText} */
    #textCoin;
    /** @type {Phaser.GameObjects.Image} */
    #iconCoin;

    #healthIcons;

    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.#scene = scene;

        this.#container = this.#scene.add.container(0, 0);

        let background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x000000);
        background.displayWidth = this.#scene.game.canvas.width ;
        background.displayHeight = 90;
        this.#container.add(background);

        background = this.#scene.add.image(0, background.displayHeight, UI_ASSET_KEYS.BLANK).setOrigin(0).setTint(0xffffff).setAlpha(0.15);
        background.displayWidth = this.#scene.game.canvas.width ;
        background.displayHeight = 4;
        this.#container.add(background);

        this.#textFloor = this.#scene.add.bitmapText(14, 20, UI_ASSET_KEYS.FONT, "Floor 0", 32).setTint(0xfff2e8).setOrigin(0, 0.5);
        this.#container.add(this.#textFloor);

        this.#textCoin = this.#scene.add.bitmapText(46, 37, UI_ASSET_KEYS.FONT, "0", 32).setTint(0xeb8932).setOrigin(0);
        this.#container.add(this.#textCoin);

        this.#iconCoin = this.#scene.add.image(6, 42, DUNGEON_ASSET_KEYS.WORLD, 226).setOrigin(0).setScale(3).setAlpha(1);

        for (let i=0; i<3; i++) {
            const icon = this.#scene.add.image( this.#scene.game.canvas.width - (i * 70) - 48, 44, UI_ASSET_KEYS.SKILL, 0).setOrigin(0.5).setScale(4).setAlpha(0.4);
        }
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * @param {number} floor 
     */
    updateFloorName(floor) {
        this.#textFloor.setText(`Floor ${floor}`);
    }

    /**
     * @param {number} coin 
     */
    updateCoins(coin) {
        this.#textCoin.setText(`${coin}`);
    }

    updateHealth(health) {
        console.log(health);
        for (let i=0; i<3; i++) {
            this.#healthIcons[i].setAlpha(1);
        }

        for (let i=2; i>=health; i--) {
            this.#healthIcons[i].setAlpha(0.4);
        }
    }
}