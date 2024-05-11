import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { Button } from "../ui/button.js";

export class AboutScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.ABOUT_SCENE,
        });
    }

    create() {
        // Title
        let title = this.add.bitmapText(0, 60, UI_ASSET_KEYS.LARGE_FONT, "About", 36);
        title.x = Math.floor((this.scale.width - title.width) / 2);

        this.add.bitmapText(40, 200, UI_ASSET_KEYS.LARGE_FONT, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel massa ac nisi accumsan ornare. Etiam id risus eu lectus molestie feugiat. Ut id lacus sapien. Vestibulum diam odio, congue nec lobortis non, sagittis eget nisl.", 24).setMaxWidth(this.scale.width - 80);

        // Back
        let button = new Button(this, UI_ASSET_KEYS.TEXT_BUTTON, () => {
            this.cameras.main.fadeOut(500, 51, 51, 51, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.TITLE_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.BitmapText(this, 0, 0, UI_ASSET_KEYS.SMALL_FONT, "BACK", 30));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = (this.scale.height - button.container.getBounds().height - 100);

        // Fade In
        this.cameras.main.fadeIn(500, 51, 51, 51);
    }

}
