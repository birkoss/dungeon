import Phaser from "../lib/phaser.js";

import { ToggleButton } from "./toggle-button.js";

export class Toggle {
    /** @type {ToggleButton[]} */
    #buttons;

    constructor() {
        this.#buttons = [];
    }

    /** @type {ToggleButton[]} */
    get buttons() {
        return this.#buttons;
    }

    /** @type {any} */
    get value() {
        return this.#buttons.find(singleButton => singleButton.isSelected).value;
    }

    /**
     * @param {ToggleButton} button
     */
    add(button) {
        this.#buttons.push(button);

        button.background.setInteractive();
        button.background.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.select(button);
        });
    }

    /**
     * @param {ToggleButton} button
     */
    select(button) {
        this.#buttons.forEach(singleButton => {
            singleButton.unselect();
        });
        button.select();
    }
}
