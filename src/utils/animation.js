export class Animation {
    /**
     * @param {Phaser.GameObjects.Sprite} sprite 
     * @param {string} key
     * @param {string} assetKey
     * @param {number[]} frames
     * @param {boolean} [loop=true]
     */
    static generate = (sprite, key, assetKey, frames, loop = true) => {
        sprite.anims.create({
            key: key,
            frames: sprite.anims.generateFrameNumbers(assetKey, { frames: frames }),
            frameRate: (loop ? 2 : 4),
            repeat: (loop ? -1 : 0),
        });
    }
}
