import Phaser from "../lib/phaser.js";

export class Dungeon {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;

    constructor(scene, width, height) {
        this.#scene = scene;
        this.#width = width;
        this.#height = height;
    }

}