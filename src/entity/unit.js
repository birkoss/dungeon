import { DUNGEON_ASSET_KEYS, MAP_ASSET_KEYS } from "../keys/asset.js";
import { Entity, ENTITY_TYPE } from "./entity.js";

export class Unit extends Entity{
    /** @type {Phaser.GameObjects.Sprite} */
    #unit;
    /** @type {Phaser.GameObjects.Sprite} */
    #unitShadow;
    /** @type {UnitData} */
    #data;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {UnitData} data
     */
    constructor(scene, x, y, data) {
        super(scene, x, y, ENTITY_TYPE.UNIT);

        this.#data = data;

        this.create();
    }

    create() {
        this.#unitShadow = super.create(MAP_ASSET_KEYS.WORLD, 101);
        this.#unit = super.create(MAP_ASSET_KEYS.UNIT, this.#data.assetFrameIndex);

        this.#createAnimation('idleRight', [this.#data.assetFrameIndex, this.#data.assetFrameIndex + 4]);
        this.#createAnimation('idleDown', [this.#data.assetFrameIndex + 1, this.#data.assetFrameIndex + 5]);
        this.#createAnimation('idleUp', [this.#data.assetFrameIndex + 2, this.#data.assetFrameIndex + 6]);
        this.#createAnimation('idleLeft', [this.#data.assetFrameIndex + 3, this.#data.assetFrameIndex + 7]);

        this.#createAnimation('attackRight', [this.#data.assetFrameIndex + 16, this.#data.assetFrameIndex + 17, this.#data.assetFrameIndex + 16], false);
        this.#createAnimation('attackDown', [this.#data.assetFrameIndex + 18, this.#data.assetFrameIndex + 19, this.#data.assetFrameIndex + 18], false);
        this.#createAnimation('attackUp', [this.#data.assetFrameIndex + 20, this.#data.assetFrameIndex + 21, this.#data.assetFrameIndex + 20], false);
        this.#createAnimation('attackLeft', [this.#data.assetFrameIndex + 22, this.#data.assetFrameIndex + 23, this.#data.assetFrameIndex + 22], false);
    
        this.idle();

        return this.#unit;
    }

    attack() {
        this.#unit.play('attackRight');
    }

    takeDamage(amount) {
        this.#unit.setTint(0xff0000);

        this._scene.time.delayedCall(400, () => {
            this.#unit.setTint(0xffffff);
        });
    }

    /**
     * @param {string} direction
     */
    face(direction) {
        this.#unit.play('idle' + direction);
    }

    idle() {
        this.#unit.play('idleRight');
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
            frameRate: (loop ? 2 : 4),
            repeat: (loop ? -1 : 0),
        });
    };
}
