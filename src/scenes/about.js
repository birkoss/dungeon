import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";
import { KENNEY_MINI_FONT_NAME } from "../keys/font.js";
import { Button } from "../ui/button.js";

export class AboutScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.ABOUT_SCENE,
        });
    }

    create() {
        // Title
        this.add.text(this.scale.width / 2, 100, "About", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }).setOrigin(0.5, 0);

        this.add.text(this.scale.width / 2, 200, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel massa ac nisi accumsan ornare. Etiam id risus eu lectus molestie feugiat. Ut id lacus sapien. Vestibulum diam odio, congue nec lobortis non, sagittis eget nisl.", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 26,
        }).setOrigin(0.5, 0).setWordWrapWidth(this.scale.width - 80);

        // Back
        let button = new Button(this, UI_ASSET_KEYS.LARGE_BUTTON, () => {
            this.cameras.main.fadeOut(500, 32, 18, 8, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start(SCENE_KEYS.TITLE_SCENE);
                }
            });
        });
        button.add(new Phaser.GameObjects.Text(this, 0, 0, "Back", {
            fontFamily: KENNEY_MINI_FONT_NAME,
            fontSize: 30,
        }));
        button.container.x = (this.scale.width - button.container.getBounds().width) / 2;
        button.container.y = (this.scale.height - button.container.getBounds().height - 100);

        // Fade In
        this.cameras.main.fadeIn(500, 32, 18, 8);
    }

}
