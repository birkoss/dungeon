import { Entity } from "./map/entity.js";


export class Player {
    /** @type {number} */
    #hp;
    /** @type {number} */
    #maxHp;
    /** @type {number} */
    #coins;
    /** @type {Entity} */
    #entity;
    /** @type {number} */
    #weapon;

    /**
     * @param {number} hp
     */
    constructor(hp) {
        this.#maxHp = this.#hp = hp;
        this.#coins = 0;
    }

    get coins() { return this.#coins; }
    get entity() { return this.#entity; }
    get hp() { return this.#hp; }
    get maxHp() { return this.#maxHp; }
    get weapon() { return this.#weapon; }

    /**
     * Add coins to the player
     * @param {number} amount
     */
    addCoins(amount) {
        this.#coins += amount;
    }

    /**
     * Heal the player
     * @param {number} amount 
     */
    heal(amount) {
        amount = Math.min(this.#maxHp - this.#hp, amount);

        this.#entity.heal(amount);
        this.#hp = this.#entity.amount;
    }

    /**
     * Pick up a new weapon
     * @param {number} amount
     */
    pickWeapon(amount) {
        this.#entity.setSecondaryAmount(amount);
        this.#weapon = this.#entity.secondaryAmount;
    }

    /**
     * Set the entity
     * @param {Entity} entity 
     */
    setEntity(entity) {
        this.#entity = entity;
    }

    /**
     * Take damage
     * @param {number} amount 
     * @param {boolean} [skipSecondaryAmount=false]
     */
    takeDamage(amount, skipSecondaryAmount = false) {
        this.#entity.takeDamage(amount, skipSecondaryAmount);

        this.#hp = this.#entity.amount;
        this.#weapon = this.#entity.secondaryAmount;
    }
}
