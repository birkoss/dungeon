import Phaser from './lib/phaser.js';

import { SCENE_KEYS } from './keys/scene.js';
import { PreloadScene } from './scenes/preload.js';
import { DungeonScene } from './scenes/dungeon.js';
import { TitleScene } from './scenes/title.js';
import { CreditsScene } from './scenes/credits.js';
import { LevelScene } from './scenes/level.js';

const game = new Phaser.Game({
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        parent: 'game-container',
        width: window.innerWidth,
        height: window.innerHeight,
    },
    backgroundColor: '#333333',
});

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.CREDITS_SCENE, CreditsScene);
game.scene.add(SCENE_KEYS.TITLE_SCENE, TitleScene);
game.scene.add(SCENE_KEYS.LEVEL_SCENE, LevelScene);
game.scene.add(SCENE_KEYS.DUNGEON_SCENE, DungeonScene);

game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
