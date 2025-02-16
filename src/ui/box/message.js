import { UI_ASSET_KEYS } from "../../keys/asset.js";
import Phaser from "../../lib/phaser.js";

import { Box } from "../box.js";
import { ActionButton } from "../button/action.js";
import { FloorButton } from "../button/floor.js";

export class MessageBox extends Box {
    #text;

    /**
     * @param {Phaser.Scene} scene 
     * @param {string} title
     * @param {string} message
     * @param {(button) => void} [buttonClickCallback]
     */
    constructor(scene, title, message, buttonClickCallback) {
        super(scene, 220, title);

        this.#text = scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT6, message, 12).setTint(0xfff2e8).setOrigin(0.5, 0);
        this.#text.setMaxWidth(this.container.getBounds().width - 30);
        this.#text.setLineSpacing(8);
        this.#text.y = -this._container.getBounds().height / 2 + this._titleContainer.getBounds().height + 15;  
        this.container.add(this.#text);

        let button = new ActionButton(this._scene, 249, "Continue", "Let's go deeper in this dungeon.", () => {
            buttonClickCallback(button);
        });
        button.container.y = this.container.getBounds().height/2 - button.container.getBounds().height/2 - 8 ;
        this.container.add(button.container);
    }
}