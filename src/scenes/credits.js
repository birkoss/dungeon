import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { Button } from "../ui/button.js";
import { Panel } from "../ui/panel.js";

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.CREDITS_SCENE,
        });
    }

    create() {
        let panel = new Panel(this, "CREDITS");

        this.add.bitmapText(this.scale.width / 2, 140, UI_ASSET_KEYS.SMALL_FONT, "Programming", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 174, UI_ASSET_KEYS.LARGE_FONT, "Mathieu Robichaud", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        this.add.bitmapText(this.scale.width / 2, 240, UI_ASSET_KEYS.SMALL_FONT, "Interface", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 274, UI_ASSET_KEYS.LARGE_FONT, "Mathieu Robichaud", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        this.add.bitmapText(this.scale.width / 2, 340, UI_ASSET_KEYS.SMALL_FONT, "Graphics", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 374, UI_ASSET_KEYS.LARGE_FONT, "VEXED : https://v3x3d.itch.io/", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        this.add.bitmapText(this.scale.width / 2, 440, UI_ASSET_KEYS.SMALL_FONT, "Fonts", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 474, UI_ASSET_KEYS.LARGE_FONT, "KENNEY : https://kenney.nl", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        this.add.bitmapText(this.scale.width / 2, 540, UI_ASSET_KEYS.SMALL_FONT, "Music", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 574, UI_ASSET_KEYS.LARGE_FONT, "XXX", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        this.add.bitmapText(this.scale.width / 2, 640, UI_ASSET_KEYS.SMALL_FONT, "SOUND", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5);
        this.add.bitmapText(this.scale.width / 2, 674, UI_ASSET_KEYS.LARGE_FONT, "XXX", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5);

        // Back
        let button = new Button(this, UI_ASSET_KEYS.TEXT_BUTTON, () => {
            this.cameras.main.fadeOut(300, 51, 51, 51, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.TITLE_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.BitmapText(this, 0, 0, UI_ASSET_KEYS.SMALL_FONT, "BACK", 30));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = (this.scale.height - button.container.getBounds().height - 100);

        // Fade In
        this.cameras.main.fadeIn(300, 51, 51, 51);
    }

}
