import { UI_ASSET_KEYS } from "../../keys/asset.js";
import Phaser from "../../lib/phaser.js";

import { Box } from "../box.js";
import { Button } from "../button.js";
import { ActionButton } from "../button/action.js";
import { AttackButton } from "../button/attack.js";
import { FloorButton } from "../button/floor.js";
import { Popup } from "../popup.js";

export class FloorBox extends Box {
    #buttons;

    #text;

    /**
     * @param {Phaser.Scene} scene 
     * @param {(button) => void} [buyCardCallback]
     */
    constructor(scene, buyCardCallback) {
        super(scene);

        this.#buttons = [];

        this.#text = scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT, "10 floors remaining", 32).setTint(0xfff2e8).setOrigin(0.5, 1);
        this.#text.y = this.container.getBounds().height / 2 - 76;
        this.container.add(this.#text);

        let button = new ActionButton(this._scene, 228, "Buy a new floor", "A new floor will be added to your list to be picked in future turn.", () => {
            buyCardCallback(button);
        });
        button.container.y = this.container.getBounds().height/2 - button.container.getBounds().height/2 - 8 ;
        this.container.add(button.container);
    }

    addButtons(buttons) {
        buttons.forEach(singleButton => {
            let button = new FloorButton(this._scene, singleButton.label, singleButton.locked, () => {
                singleButton.callback(button);
            });
            this.addButton(button, singleButton.locked);
        });
    }

    /**
     * @param {FloorButton} button 
     * @param {boolean} [locked=true] 
     */
    addButton(button, locked = true) {
        let existingCallback = button.callback;
        button.callback = () => {
            this.hide(existingCallback);
        };

        let padding = 4;

        let spacing = (this.container.getBounds().width - padding*2 - 3 * button.container.getBounds().width) / 2;
        button.container.y = -this.container.getBounds().height / 2 + button.container.getBounds().height/2 + padding*2; 
        button.container.x = -this.container.getBounds().width / 2 + button.container.getBounds().width/2 + padding*2; 
        button.container.x += this.#buttons.length * (button.container.getBounds().width + spacing - padding);

        this.#buttons.push(button);
        this.container.add(button.container);
    }

    setText(floors) {
        this.#text.setText(floors.toString() + " floors remaining");
    }
}