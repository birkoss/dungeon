import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { Button } from "../ui/button.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.TITLE_SCENE,
        });
    }

    create() {
        // Title
        let title = this.add.bitmapText(0, 60, UI_ASSET_KEYS.LARGE_FONT, "Untitled\nGame", 48, Phaser.GameObjects.BitmapText.ALIGN_CENTER);
        title.x = Math.floor((this.scale.width - title.width) / 2);

        // Play
        let button = new Button(this, UI_ASSET_KEYS.LARGE_TEXT_BUTTON, () => {
            this.cameras.main.fadeOut(300, 51, 51, 51, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.LEVEL_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.BitmapText(this, 0, 0, UI_ASSET_KEYS.SMALL_FONT, "PLAY", 30));
        button.container.x = Math.floor((this.scale.width - button.container.getBounds().width) / 2);
        button.container.y = 250;

        // About
        button = new Button(this, UI_ASSET_KEYS.LARGE_TEXT_BUTTON, () => {
            this.cameras.main.fadeOut(300, 51, 51, 51, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.CREDITS_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.BitmapText(this, 0, 0, UI_ASSET_KEYS.SMALL_FONT, "CREDITS", 30));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = 400;

        // Fade In
        this.cameras.main.fadeIn(300, 51, 51, 51);
    }
}
