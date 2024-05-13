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

        let button = new Button(this, UI_ASSET_KEYS.BUTTON_BLUE, () => {
            this.cameras.main.fadeOut(300, 51, 51, 51, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.TITLE_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.Image(this, 0, 0, UI_ASSET_KEYS.ICONS, 9).setScale(0.75));
        button.container.x = 14;
        button.container.y = 7;

        let container = this.add.container(0, 0);

        container.add(this.add.bitmapText(this.scale.width / 2, 0, UI_ASSET_KEYS.SMALL_FONT, "Programming", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 34, UI_ASSET_KEYS.LARGE_FONT, "Mathieu Robichaud", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.add(this.add.bitmapText(this.scale.width / 2, 100, UI_ASSET_KEYS.SMALL_FONT, "Interface", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 134, UI_ASSET_KEYS.LARGE_FONT, "Mathieu Robichaud", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.add(this.add.bitmapText(this.scale.width / 2, 200, UI_ASSET_KEYS.SMALL_FONT, "Graphics", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 234, UI_ASSET_KEYS.LARGE_FONT, "VEXED : https://v3x3d.itch.io/", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.add(this.add.bitmapText(this.scale.width / 2, 300, UI_ASSET_KEYS.SMALL_FONT, "Fonts", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 334, UI_ASSET_KEYS.LARGE_FONT, "KENNEY : https://kenney.nl", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.add(this.add.bitmapText(this.scale.width / 2, 400, UI_ASSET_KEYS.SMALL_FONT, "Music", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 434, UI_ASSET_KEYS.LARGE_FONT, "XXX", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.add(this.add.bitmapText(this.scale.width / 2, 500, UI_ASSET_KEYS.SMALL_FONT, "SOUND", 30).setMaxWidth(this.scale.width - 80).setOrigin(0.5));
        container.add(this.add.bitmapText(this.scale.width / 2, 534, UI_ASSET_KEYS.LARGE_FONT, "XXX", 24).setMaxWidth(this.scale.width - 80).setOrigin(0.5));

        container.y = (this.scale.height - container.getBounds().height) / 2;
        container.y += 85/2;

        // Fade In
        this.cameras.main.fadeIn(300, 51, 51, 51);
    }

}
