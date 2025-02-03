export const TILE_TYPE = Object.freeze({
    WALL: 'WALL',
    FLOOR: 'FLOOR',
});

export class Tile {
    #x;
    #y;
    /** @type {keyof typeof TILE_TYPE} */
    #type;

    constructor(x, y, type) {
        this.#x = x;
        this.#y = y;
        this.#type = type;
    }

    get type() { return this.#type; }
    get x() { return this.#x; }
    get y() { return this.#y; }
}