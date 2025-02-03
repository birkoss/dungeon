import { DUNGEON_ASSET_KEYS } from "./keys/asset.js";

export class Unit {
    #x;
    #y;
    #scene;
    #mainFrame;

    #hp;

    /**
     * @type {Phaser.GameObjects.Sprite}
     */
    #gameObject;

    constructor(scene, x, y, frame) {
        const scale = 4;

        this.#hp = 3;

        this.#scene = scene;
        this.#x = x;
        this.#y = y;
        this.#mainFrame = frame;

        this.#gameObject = scene.add.sprite(x * 10 * scale, y * 10 * scale, DUNGEON_ASSET_KEYS.UNIT, frame).setScale(scale);

        this.#createAnimation('idleRight', [frame, frame + 4]);
        this.#createAnimation('idleBottom', [frame + 1, frame + 5]);
        this.#createAnimation('idleTop', [frame + 2, frame + 6]);
        this.#createAnimation('idleLeft', [frame + 3, frame + 7]);

        this.#createAnimation('attackRight', [frame + 8, frame + 9, frame + 8], false);
        this.#createAnimation('attackBottom', [frame + 10, frame + 11, frame + 10], false);
        this.#createAnimation('attackTop', [frame + 12, frame + 13, frame + 12], false);
        this.#createAnimation('attackLeft', [frame + 14, frame + 15, frame + 14], false);

        this.#gameObject.anims.play('idleRight');
    }

    get gameObject() { return this.#gameObject; }
    get isAlive() { return this.#hp > 0; }
    get x() { return this.#x; }
    get y() { return this.#y; }

    attackUnit(defender, callback) {
        let newAnimationKey = this.#gameObject.anims.currentAnim.key;

        if (defender.y == this.y) {
            newAnimationKey = (defender.x > this.x ? 'Right' : 'Left');
        } else if (defender.x == this.x) {
            newAnimationKey = (defender.y > this.y ? 'Bottom' : 'Top');
        }

        this.#scene.time.delayedCall(200, () => {
            defender.takeDamage(1);
        });

        this.#gameObject.anims.play("attack" + newAnimationKey).once('animationcomplete', () => {
            this.#gameObject.anims.play("idle" + newAnimationKey);

            callback();
         });
    }

    takeDamage(amount) {
        this.#hp = Math.max(this.#hp - amount, 0);

        this.#gameObject.setTint(0xff0000);

        this.#scene.time.delayedCall(400, () => {
            this.#gameObject.setTint(0xffffff);

            if (!this.isAlive) {
                this.#gameObject.anims.stop();
                this.#gameObject.setFrame(this.#mainFrame + 16);
            }
        });
    }

    move(x, y, callback) {
        let newAnimationKey = this.#gameObject.anims.currentAnim.key;

        if (y == this.y) {
            newAnimationKey = "idle" + (x > this.x ? 'Right' : 'Left');
        } else if (x == this.x) {
            newAnimationKey = "idle" + (y > this.y ? 'Bottom' : 'Top');
        }

        if (newAnimationKey !== this.#gameObject.anims.currentAnim.key) {
            this.#gameObject.anims.play(newAnimationKey);
        }

        this.#x = x;
        this.#y = y;

        this.#scene.add.tween({
            targets: this.#gameObject,
            duration: 200,
            x: x * 10 * 4,
            y: y * 10 * 4,
            onComplete: callback
        });
    }

    #createAnimation = (key, frames, loop = true) => {
        this.#gameObject.anims.create({
            key: key,
            frames: this.#gameObject.anims.generateFrameNumbers(DUNGEON_ASSET_KEYS.UNIT, { frames: frames }),
            frameRate: (loop ? 2 : 5),
            repeat: (loop ? -1 : 0),
        });
    };
}

