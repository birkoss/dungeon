import Phaser from "../../../lib/phaser.js";

/** @typedef {keyof typeof TILE_ENTITY_TYPE} TileEntityType */
/** @enum {TileEntityType} */
export const TILE_ENTITY_TYPE = Object.freeze({
    BACKGROUND: 'BACKGROUND',
    WALL: 'WALL',
    ENEMY: 'ENEMY',
    CHEST: 'CHEST',
});

export class TileEntity {
    /** @type {TileEntityType} */
    _type;
    /** @protected @type {Phaser.GameObjects.Sprite} */
    _gameObject;

    /**
     * @param {TileEntityType} type 
     */
    constructor(type) {
        this._type = type;
    }

    /** @type {Phaser.GameObjects.Sprite} */
    get gameObject() {
        return this._gameObject;
    }
    /** @type {TileEntityType} */
    get type() {
        return this._type;
    }

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} [assetKey]
     * @param {number | number[]} [assetFrames]
     * @returns {Phaser.GameObjects.Sprite}
     */
    create(scene, assetKey, assetFrames) {
        let assetFrame = Array.isArray(assetFrames) ? assetFrames[0] : assetFrames;

        this._gameObject = scene.add.sprite(0, 0, assetKey, assetFrame).setOrigin(0.5);
        this._gameObject.x = this._gameObject.width / 2;
        this._gameObject.y = this._gameObject.height / 2;

        if (Array.isArray(assetFrames)) {
            let animationFrames = this._gameObject.anims.generateFrameNumbers(assetKey, {
                frames: assetFrames
            });
    
            this._gameObject.anims.create({
                key: 'idle',
                frames: animationFrames,
                frameRate: 2,
                repeat: -1,
            });

            this._gameObject.anims.play('idle');
        }
        

        return this._gameObject;
    }

    /**
     * @param {() => void} [callback]
     * @param {number} [duration]
     */
    fadeIn(callback, duration) {
        this._gameObject.setAlpha(0);

        this._gameObject.scene.add.tween({
            targets: [
                this._gameObject,
            ],
            alpha: 1,
            duration: duration || 500,
            ease: Phaser.Math.Easing.Cubic.Out,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }
    /**
     * @param {() => void} [callback]
     * @param {number} [duration]
     */
    fadeOut(callback, duration) {
        this._gameObject.setAlpha(1);

        this._gameObject.scene.add.tween({
            targets: [
                this._gameObject,
            ],
            alpha: 0,
            duration: duration || 500,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }

    /**
     * @param {() => void} [callback]
     */
    scaleIn(callback) {
        this._gameObject.setScale(0);
        this._gameObject.setAlpha(0);

        this._gameObject.scene.add.tween({
            targets: [
                this._gameObject,
            ],
            alpha: 1,
            scaleY: 1,
            scaleX: 1,
            duration: 400,
            ease: Phaser.Math.Easing.Bounce.Out,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }
    /**
     * @param {() => void} [callback]
     * @param {number} [duration]
     */
    scaleOut(callback, duration) {
        this._gameObject.scene.add.tween({
            targets: [
                this._gameObject,
            ],
            scaleY: 0,
            scaleX: 0,
            duration: duration || 400,
            ease: Phaser.Math.Easing.Bounce.In,
            onComplete: () => {
                if (callback) {
                    callback();
                }
            }
        });
    }
}
