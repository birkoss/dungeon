import Phaser from "../lib/phaser.js";

import { UI_ASSET_KEYS } from "../keys/asset.js";

/**
 * @typedef {Object} BubbleConfig
 * @property {Phaser.Scene} scene
 * @property {string} message
 * @property {number} [tailPosition=7]
 * @property {number} [x]
 * @property {number} [y]
 * @property {Object} [minSize] - Force a minimum size constraints
 * @property {number} [minSize.width=0] - Minimum width
 * @property {number} [minSize.height=0] - Minimum height
 * @property {number} [scale=4] - Scale factor for bubble
 */

export class Bubble {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.Image} */
    #background;

    /**
     * @param {BubbleConfig} config 
     */
    constructor(config) {
        this.#scene = config.scene;

        this.#background = this.#scene.add.image(this.#scene.game.canvas.width/2, this.#scene.game.canvas.height/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x000000).setAlpha(0);
        this.#background.displayWidth = this.#scene.game.canvas.width;
        this.#background.displayHeight = this.#scene.game.canvas.height;
        this.#background.setInteractive();
        this.#background.on('pointerup', () => {
            this.hide();
        });

        this.#container = this.#scene.add.container(config.x || this.#scene.game.canvas.width/2, config.y || this.#scene.game.canvas.height/2);

        const scale = config.scale || 4;
        const tailPosition = config.tailPosition || 7;

        // Create the bubble (9 frames)
        const frames = [];
        for (let i=0; i<9; i++) {
            let frame = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BUBBLE, i).setOrigin(0.5).setScale(scale);
            this.#container.add(frame);
            frames.push(frame);
        }

        // Create the text to determine the size
        const text = this.#scene.add.bitmapText(0, -2, UI_ASSET_KEYS.FONT, config.message, 16).setTint(0x333333).setOrigin(0.5).setMaxWidth(config.minSize.width || 200);
        this.#container.add(text);

        // Get the size base on the param or the text size (and make it even)
        let width = config.minSize.width || 0;
        if (width <= 0) {
            width = Math.round(text.width - frames[3].width - frames[5].width);
        }
        width += width % 2;
        let height = config.minSize.height || 0;
        if (height <= 0) {
            height = Math.round(text.height - frames[1].height - frames[7].height);
        }
        height += height % 2;

        this.#adjustFrames(frames, width, height);

        if (tailPosition !== -1) {
            this.#addTail(frames, tailPosition, scale);
        }
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * Show the bubble with a fade in effect
     * @param {() => void} [callback] 
     */
    show(callback) {
        this.#container.alpha = 0;
        this.#container.setScale(0);

        this.#scene.add.tween({
            targets: this.#container,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            onComplete: () => {
                this.#scene.add.tween({
                    targets: this.#background,
                    alpha: 0.3,
                    duration: 200,
                    onComplete: callback,
                });
            },
        });
    }

    /**
     * Show the bubble with a fade in effect
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this.#scene.add.tween({
            targets: this.#container,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            onComplete: () => {
                this.#scene.add.tween({
                    targets: this.#background,
                    alpha: 0,
                    duration: 200,
                    onComplete: callback,
                });
            },
        });
    }

    /**
     * Add the tail to the bubble and set its position
     * @param {Phaser.GameObjects.Image[]} frames
     * @param {number} tailPosition
     * @param {number} scale
     */
    #addTail(frames, tailPosition, scale) {
        // Tail
        let tail = this.#scene.add.image(0, 0, UI_ASSET_KEYS.BUBBLE, 9).setOrigin(0.5).setScale(scale);

        // Top
        if (tailPosition === 0 || tailPosition === 1 || tailPosition === 2) {
            tail.setFrame(11);
            tail.y = frames[1].y - frames[1].displayHeight/2 - tail.displayHeight / 2 + scale;
            if (tailPosition === 0) {
                tail.x = frames[0].x + 12;
            } else if (tailPosition === 2) {
                tail.x = frames[2].x - 12;
            }
        }

        // Right
        if (tailPosition === 3 || tailPosition === 4 || tailPosition === 5) {
            tail.setFrame(12);
            tail.x = frames[5].x + frames[5].displayWidth/2 + tail.displayWidth / 2 - scale;
            if (tailPosition === 3) {
                tail.y = frames[2].y + 12;
            } else if (tailPosition === 5) {
                tail.y = frames[8].y - 12;
            }
        }

        // Bottom
        if (tailPosition === 6 || tailPosition === 7 || tailPosition === 8) {
            tail.y = frames[8].y + frames[8].displayHeight/2 + tail.displayHeight / 2 - scale;
            if (tailPosition === 6) {
                tail.x = frames[8].x - 12;
            } else if (tailPosition === 8) {
                tail.x = frames[6].x + 12;
            }
        }

        // Left
        if (tailPosition === 9 || tailPosition === 10 || tailPosition === 11) {
            tail.setFrame(10);
            tail.x = frames[3].x - frames[3].displayWidth/2 - tail.displayWidth / 2 + scale;
            if (tailPosition === 9) {
                tail.y = frames[6].y - 12;
            } else if (tailPosition === 11) {
                tail.y = frames[0].y + 12;
            }
        }

        this.#container.add(tail);
    }

    /**
     * Ajuste the frames based on the width and height
     * @param {Phaser.GameObjects.Image[]} frames 
     * @param {number} width 
     * @param {number} height 
     */
    #adjustFrames(frames, width, height) {
        // Adjust the center frame first
        frames[4].displayWidth = width;
        frames[4].displayHeight = height;
        frames[4].y = 0;

        // Adjust the top frames
        frames[0].x = Math.round(-frames[4].displayWidth/2 - frames[0].displayWidth/2);
        frames[0].y = Math.round(-frames[4].displayHeight/2 - frames[0].displayHeight/2);

        frames[1].displayWidth = width;
        frames[1].y = Math.round(frames[4].y - frames[4].displayHeight/2 - frames[1].displayHeight/2);

        frames[2].x = Math.round(frames[4].displayWidth/2 + frames[2].displayWidth/2);
        frames[2].y = Math.round(-frames[4].displayHeight/2 - frames[2].displayHeight/2);

        // Adjust the middle frames
        frames[3].displayHeight = height;
        frames[3].x = Math.round(-frames[4].displayWidth/2 - frames[3].displayWidth/2);
        frames[3].y = 0;

        frames[5].displayHeight = height;
        frames[5].x = Math.round(frames[4].displayWidth/2 + frames[5].displayWidth/2);
        frames[5].y = 0;

        // Adjust the bottom frames
        frames[6].x = Math.round(-frames[4].displayWidth/2 - frames[6].displayWidth/2);
        frames[6].y = Math.round(frames[4].displayHeight/2 + frames[6].displayHeight/2);

        frames[7].displayWidth = width;
        frames[7].y = Math.round(frames[4].y + frames[4].displayHeight/2 + frames[7].displayHeight/2);

        frames[8].x = Math.round(frames[4].displayWidth/2 + frames[8].displayWidth/2);
        frames[8].y = Math.round(frames[4].displayHeight/2 + frames[8].displayHeight/2);
    }
}
