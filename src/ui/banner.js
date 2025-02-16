import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

export class Banner {
    /** @type {Phaser.Scene} */
    #scene;
    
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.Image} */
    #background;
    /** @type {Phaser.GameObjects.BitmapText} */
    #text;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} message
     */
    constructor(scene, message) {
        this.#scene = scene;

        this.#container = this.#scene.add.container(this.#scene.game.canvas.width/2, this.#scene.game.canvas.height/2);

        this.#background = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x000000);
        this.#background.displayWidth = this.#scene.game.canvas.width;
        this.#background.displayHeight = 200;
        this.#container.add(this.#background);

        this.#text = this.#scene.add.bitmapText(-this.#scene.game.canvas.width, -6, UI_ASSET_KEYS.FONT6, message, 12).setTint(0xfff2e8).setOrigin(0.5).setAlpha(1);
        this.#container.add(this.#text);
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * @param {() => void} [callback]
     */
    show(callback) {
        this.#background.displayHeight = 0;
        this.#scene.add.tween({
            targets: this.#background,
            displayHeight: 60,
            duration: 200,
            onComplete: () => {
                let borders = [];
                let border = this.#scene.add.image(0, this.#background.displayHeight/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xfff2e8).setAlpha(0);
                border.displayWidth = this.#scene.game.canvas.width;
                border.displayHeight = 4;
                this.#container.add(border);
                this.#scene.add.tween({
                    targets: border,
                    alpha: 1,
                    duration: 100,
                });
                borders.push(border);
                
                border = this.#scene.add.image(0, -this.#background.displayHeight/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0xfff2e8).setAlpha(0);
                border.displayWidth = this.#scene.game.canvas.width;
                border.displayHeight = 4;
                this.#container.add(border);
                this.#scene.add.tween({
                    targets: border,
                    alpha: 1,
                    duration: 100,
                });
                borders.push(border);

                this.#scene.add.tween({
                    targets: this.#text,
                    x: 0,
                    duration: 200,
                    onComplete: () => {
                        this.#scene.time.delayedCall(800, () => {
                            this.#scene.add.tween({
                                targets: this.#text,
                                x: this.#scene.game.canvas.width,
                                duration: 200,
                                onComplete: () => {
                                    borders.forEach(singleBorder => {
                                        this.#scene.add.tween({
                                            targets: singleBorder,
                                            alpha: 0,
                                            duration: 100,
                                            onComplete: () => {
                                                singleBorder.destroy();
                                            },
                                        });
                                    });

                                    this.#scene.add.tween({
                                        targets: this.#background,
                                        displayHeight: 0,
                                        duration: 200,
                                        onComplete: callback,
                                    });
                                }
                            });
                        });
                    }
                });
            },
        });
    }
}
