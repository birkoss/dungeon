import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";

export class Action {
    #scene;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    #gameObject;

    constructor(scene, x, y, frame, callback) {
        const scale = 4;

        this.#scene = scene;

        this.#gameObject = scene.add.sprite(x, y, DUNGEON_ASSET_KEYS.ACTION, frame).setScale(scale).setTint(0xdcdcdc);

        this.#gameObject.anims.create({
            key: 'idle',
            frames: this.#gameObject.anims.generateFrameNumbers(DUNGEON_ASSET_KEYS.ACTION, { frames: [frame, frame+1] }),
            frameRate: 1,
            repeat: -1,
        });
        this.#gameObject.anims.play('idle');

        this.#gameObject.setAlpha(0);
        this.#scene.add.tween({
            targets: this.#gameObject,
            alpha: 1,
            duration: 100,
        });

        this.#gameObject.setInteractive();
        this.#gameObject.on('pointerdown', () => {
            this.hide();

            if (callback) {
                callback();
            }
        });
    }

    get gameObject() { return this.#gameObject; }

    hide() {
        this.#scene.add.tween({
            targets: this.#gameObject,
            alpha: 0,
            duration: 100,
            onComplete: () => {
                this.#gameObject.destroy();
            },
        });
    }
}

