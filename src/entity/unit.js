import { MAP_ASSET_KEYS } from "../keys/asset.js";
import { Entity, ENTITY_TYPE } from "./entity.js";

export const UNIT_AI = Object.freeze({
    PLAYER: 'PLAYER',
    AI: 'AI',
});

export class Unit extends Entity{
    /** @type {Phaser.GameObjects.Sprite} */
    #unit;
    /** @type {Phaser.GameObjects.Sprite} */
    #unitShadow;
    /** @type {UnitData} */
    #data;
    /** @type {keyof typeof UNIT_AI} */
    #ai;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {keyof typeof UNIT_AI} ai
     * @param {UnitData} data
     */
    constructor(scene, x, y, ai, data) {
        super(scene, x, y, ENTITY_TYPE.UNIT);

        this.#ai = ai;
        this.#data = data;

        this.create();
    }

    get ai() { return this.#ai; }

    create() {
        this.#unitShadow = super.create(MAP_ASSET_KEYS.WORLD, 101);
        this.#unit = super.create(MAP_ASSET_KEYS.UNIT, this.#data.assetFrameIndex);

        this.#createAnimation('idleRight', [this.#data.assetFrameIndex, this.#data.assetFrameIndex + 4]);
        this.#createAnimation('idleDown', [this.#data.assetFrameIndex + 1, this.#data.assetFrameIndex + 5]);
        this.#createAnimation('idleUp', [this.#data.assetFrameIndex + 2, this.#data.assetFrameIndex + 6]);
        this.#createAnimation('idleLeft', [this.#data.assetFrameIndex + 3, this.#data.assetFrameIndex + 7]);

        this.#createAnimation('attackRight', [this.#data.assetFrameIndex + 16, this.#data.assetFrameIndex + 17], false);
        this.#createAnimation('attackDown', [this.#data.assetFrameIndex + 18, this.#data.assetFrameIndex + 19], false);
        this.#createAnimation('attackUp', [this.#data.assetFrameIndex + 20, this.#data.assetFrameIndex + 21], false);
        this.#createAnimation('attackLeft', [this.#data.assetFrameIndex + 22, this.#data.assetFrameIndex + 23], false);
    
        this.#unit.play('idleRight');

        return this.#unit;
    }

    /**
     * @param {() => void} [callback]
     */
    attack(callback) {
        const direction = this.#unit.anims.currentAnim.key.replace("idle", "");

        this.#unit.play('attack' + direction);
        this.#unit.anims.play("attack" + direction).once('animationcomplete', () => {
            this.#unit.anims.play("idle" + direction);
            if (callback) {
                callback();
            }
        });
    }

    /**
     * @param {number} amount
     * @param {() => void} [callback]
     */
    takeDamage(amount, callback) {
        this.#unit.setTint(0xff0000);

        this._scene.time.delayedCall(400, () => {
            this.#unit.setTint(0xffffff);
            if (callback) {
                callback();
            }
        });
    }

    /**
     * @param {string} direction
     */
    face(direction) {
        this.#unit.play('idle' + direction);
    }

    idle() {
        const direction = this.#unit.anims.currentAnim.key.replace("idle", "").replace("attack", "");
        this.#unit.play('idle' + direction);
    }


    /**
     * @param {string} key 
     * @param {number[]} frames 
     * @param {boolean} [loop=true] 
     */
    #createAnimation = (key, frames, loop = true) => {
        this.#unit.anims.create({
            key: key,
            frames: this.#unit.anims.generateFrameNumbers(MAP_ASSET_KEYS.UNIT, { frames: frames }),
            frameRate: (loop ? 2 : 8),
            repeat: (loop ? -1 : 0),
        });
    };
}
