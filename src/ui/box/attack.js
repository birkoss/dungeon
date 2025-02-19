import Phaser from "../../lib/phaser.js";

import { Box } from "../box.js";
import { ActionButton } from "../button/action.js";

export class AttackBox extends Box {
    #buttons;

    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        super(scene);

        this.#buttons = [];
    }

    /**
     * @param {ActionButton} button 
     * @param {boolean} [lastAction=true] 
     */
    addButton(button, lastAction = true) {
        if (lastAction) {
            let existingCallback = button.callback;
            button.callback = () => {
                this.hide(existingCallback);
            };
        }

        button.container.y = -this.container.getBounds().height / 2 + button.container.getBounds().height/2; 

        button.container.y += this.#buttons.length * (button.container.getBounds().height + 8) + 8;

        this.#buttons.push(button);
        this.container.add(button.container);
    }
}