import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";
import { Button } from "../ui/button.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.TITLE_SCENE,
        });
    }

    create() {
        // Title
        this.add.text(this.scale.width / 2, 100, "Untitled", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }).setOrigin(0.5, 0);

        // Play
        let button = new Button(this, UI_ASSET_KEYS.LARGE_BUTTON, 0, () => {
            this.cameras.main.fadeOut(500, 32, 18, 8, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.LEVEL_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.Text(this, 0, 0, "Play", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = 250;

        // About
        button = new Button(this, UI_ASSET_KEYS.LARGE_BUTTON, 0, () => {
            this.cameras.main.fadeOut(500, 32, 18, 8, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.ABOUT_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.Text(this, 0, 0, "About", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = 400;

        // Fade In
        this.cameras.main.fadeIn(500, 32, 18, 8);
    }
}
