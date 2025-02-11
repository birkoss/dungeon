import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Message {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} message
     */
    constructor(scene, message) {
        this.#scene = scene;

        this.#container = this.#scene.add.container(this.#scene.game.canvas.width/2, this.#scene.game.canvas.height/2);

        const background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x000000);
        background.displayWidth = this.#scene.game.canvas.width ;
        background.displayHeight = 200;
        this.#container.add(background);

        const text = this.#scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT, message, 32).setTint(0xfff2e8).setOrigin(0.5).setAlpha(0);
        this.#container.add(text);

        background.displayHeight = 0;
        this.#scene.add.tween({
            targets: background,
            displayHeight: 200,
            duration: 200,
            onComplete: () => {
                let border = this.#scene.add.image(0, background.displayHeight/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xfff2e8).setAlpha(0);
                border.displayWidth = this.#scene.game.canvas.width;
                border.displayHeight = 4;
                this.#container.add(border);
                this.#scene.add.tween({
                    targets: border,
                    alpha: 1,
                    duration: 100,
                });
                
                border = this.#scene.add.image(0, -background.displayHeight/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xfff2e8).setAlpha(0);
                border.displayWidth = this.#scene.game.canvas.width;
                border.displayHeight = 4;
                this.#container.add(border);
                this.#scene.add.tween({
                    targets: border,
                    alpha: 1,
                    duration: 100,
                });

                this.#scene.add.tween({
                    targets: text,
                    alpha: 1,
                    duration: 100,
                });
            },
        });
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }
}
