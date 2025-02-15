import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Map, MAP_FLOOR } from "../map/map.js";
import { Data } from "../utils/data.js";
import { StateMachine } from "../state-machine.js";
import { Unit, UNIT_AI } from "../entity/unit.js";
import { Popup } from "../ui/popup.js";
import { AttackBox } from "../ui/box/attack.js";
import { FloorBox } from "../ui/box/floor.js";
import { AttackButton } from "../ui/button/attack.js";
import { ActionButton } from "../ui/button/action.js";

const MAIN_STATES = Object.freeze({
    CREATE_DUNGEON: 'CREATE_DUNGEON',
    CREATE_PARTY: 'CREATE_PARTY',
    CREATE_MAP: 'CREATE_MAP',
    LOAD_FLOOR: 'LOAD_FLOOR',
    TURN_START: 'TURN_START',
    SELECT_UNIT: 'SELECT_UNIT',
    UNIT_DONE: 'UNIT_DONE',
    TURN_END: 'TURN_END',
    PICK_FLOOR: 'PICK_FLOOR',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Map} */
    #map;
    /** @type {StateMachine} */
    #stateMachine;

    /** @type {Array<keyof typeof MAP_FLOOR>} */
    #floors;

    #party;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#createStateMachine();
        this.#stateMachine.setState(MAIN_STATES.CREATE_DUNGEON);
    }

    update() {
        if (this.#stateMachine) {
            this.#stateMachine.update();
        }
    }

    #createStateMachine() {
        this.#stateMachine = new StateMachine('MAIN', this);

        // CREATE_DUNGEON
        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_DUNGEON,
            onEnter: () => {
                this.#floors = [
                    MAP_FLOOR.ENEMY,
                    MAP_FLOOR.ENEMY,
                    MAP_FLOOR.ENEMY,
                    MAP_FLOOR.ENEMY,
                    MAP_FLOOR.ENEMY,
                    MAP_FLOOR.BOSS,
                    MAP_FLOOR.EMPTY,
                    MAP_FLOOR.TAVERN,
                    MAP_FLOOR.CHEST,
                ];

                Phaser.Utils.Array.Shuffle(this.#floors);
                
                // Always force an enemy to be the first floor
                // TODO: test another floor this.#floors.unshift(MAP_FLOOR.EMPTY);
                this.#floors.unshift(MAP_FLOOR.ENEMY);

                this.#stateMachine.setState(MAIN_STATES.CREATE_PARTY);
            },
        });

        // CREATE_PARTY
        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_PARTY,
            onEnter: () => {
                this.#party = [
                    Data.getUnit(this, 'warrior'),
                ];

                this.#stateMachine.setState(MAIN_STATES.CREATE_MAP);
            },
        });

        // CREATE_MAP
        this.#stateMachine.addState({
            name: MAIN_STATES.CREATE_MAP,
            onEnter: () => {
                this.#map = new Map(this, 7, 7);
                this.#map.container.x = (this.scale.width - this.#map.container.getBounds().width) / 2;
                this.#map.container.y = this.#map.container.x;

                this.#stateMachine.setState(MAIN_STATES.LOAD_FLOOR);
            },
        });

        // LOAD_FLOOR
        this.#stateMachine.addState({
            name: MAIN_STATES.LOAD_FLOOR,
            onEnter: () => {
                this.#map.hide(() => {
                    let floor = this.#floors.shift();

                    this.#map.loadFloor(floor, {
                        party: this.#party,
                    });
            
                    if (this.#map.floor === MAP_FLOOR.EMPTY) {
                        this.#map.show(() => {
                            this.#stateMachine.setState(MAIN_STATES.PICK_FLOOR);
                        });
                        return;
                    }

                    if (this.#map.floor === MAP_FLOOR.ENEMY || this.#map.floor === MAP_FLOOR.BOSS) {
                        this.#map.units.forEach((singleUnit) => {
                            singleUnit.showHealthBar();
                        });
            
                        this.#map.show(() => {
                            this.#stateMachine.setState(MAIN_STATES.TURN_START);
                        });
                    }
                });
            },
        });

        // TURN_START
        this.#stateMachine.addState({
            name: MAIN_STATES.TURN_START,
            onEnter: () => {
                if (this.#map.floor === MAP_FLOOR.ENEMY) {
                    this.#map.createQueue();
                    this.#stateMachine.setState(MAIN_STATES.SELECT_UNIT);
                    return;
                }
            },
        });

        // SELECT_UNIT
        this.#stateMachine.addState({
            name: MAIN_STATES.SELECT_UNIT,
            onEnter: () => {
                const unit = this.#map.getNextQueuedUnit();
                if (!unit) {
                    this.#stateMachine.setState(MAIN_STATES.TURN_END);
                    return;
                }

                if (unit.ai === UNIT_AI.AI) {
                    const players = this.#map.units.filter((singleUnit) => singleUnit.ai === UNIT_AI.PLAYER);

                    this.#map.clearSelections();
                    this.#attack(unit, players[0], () => {
                        this.#stateMachine.setState(MAIN_STATES.UNIT_DONE);
                    });
                    // LOAD AI!
                    console.log("AI ");
                    return;
                }

                const enemies = this.#map.units.filter((singleUnit) => singleUnit.ai === UNIT_AI.AI);
                const enemy = enemies.shift();

                this.#map.selectUnit(enemy);

                
                let box = new AttackBox(this);
                box.container.x = this.game.canvas.width/2;
                // box.container.y = this.#map.container.y + this.#map.container.getBounds().height + 100;
                box.container.y = this.#map.container.y * 2 + this.#map.container.getBounds().height + box.container.getBounds().height/2;

                box.addButton(new ActionButton(this, 187, "Basic Attack", "Basic attack will deals 2 damage to selected unit", () => {
                    this.#map.clearSelections();

                    this.#attack(unit, enemy, () => {
                        this.#stateMachine.setState(MAIN_STATES.UNIT_DONE);
                    });
                    
                }));

                box.addButton(new ActionButton(this, 197, "Use a Potion", "Potion will heal the current unit for 2 HP", () => {
                    // ...
                }));

                box.addButton(new ActionButton(this, 214, "Slash", "Slash will deals 1 damage to all enemies", () => {
                    // ...
                }));

                box.show();
                
            },
        });

        // UNIT_DONE
        this.#stateMachine.addState({
            name: MAIN_STATES.UNIT_DONE,
            onEnter: () => {
                this.#map.verifyQueue();

                // No party left...
                if (this.#map.units.filter((singleUnit) => singleUnit.ai === UNIT_AI.PLAYER && singleUnit.isAlive).length === 0) {
                    console.error("GAME OVER!");
                    return;
                }

                // No enemy left...
                if (this.#map.units.filter((singleUnit) => singleUnit.ai === UNIT_AI.AI && singleUnit.isAlive).length === 0) {
                    
                    this.#map.units.forEach((singleUnit) => {
                        if (!singleUnit.isAlive || singleUnit.ai === UNIT_AI.AI) {
                            return;
                        }

                        let xp = 10;

                        new Popup(
                            this,
                            this.#map.container.x + singleUnit.container.x,
                            this.#map.container.y + singleUnit.container.y,
                            "+" + xp.toString() + " xp",
                            0x00ff00
                        );

                        this.#stateMachine.setState(MAIN_STATES.PICK_FLOOR);
                    });
                    return;
                }
                
                // Next unit in the queue
                this.#stateMachine.setState(MAIN_STATES.SELECT_UNIT);
            },
        });

        // TURN_END
        this.#stateMachine.addState({
            name: MAIN_STATES.TURN_END,
            onEnter: () => {
                this.#stateMachine.setState(MAIN_STATES.TURN_START);
            },
        });

       // PICK_FLOOR
       this.#stateMachine.addState({
        name: MAIN_STATES.PICK_FLOOR,
        onEnter: () => {
            Phaser.Utils.Array.Shuffle(this.#floors);

            let box = new FloorBox(this, (button) => {
                const popup = new Popup(
                    this,
                    box.container.x + button.container.x,
                    box.container.y + button.container.y,
                    "- 25 $",
                    0xeb8932
                );
                popup.text.setScale(2);

                this.#floors.push(MAP_FLOOR.ENEMY);
                box.setText(this.#floors.length);
            });
            box.container.x = this.game.canvas.width/2;
            // box.container.y = this.#map.container.y + this.#map.container.getBounds().height + 100;
            box.container.y = this.#map.container.y * 2 + this.#map.container.getBounds().height + box.container.getBounds().height/2;

            let buttons = [];

            for (let i=0; i<this.#floors.length; i++) {
                buttons.push({
                    label: this.#floors[i],
                    callback: (button) => {
                        // Put floor at i first
                        this.#floors.unshift(this.#floors.splice(i, 1)[0]);

                        this.#stateMachine.setState(MAIN_STATES.LOAD_FLOOR);
                    },
                    locked: false,
                });
                
                if (i >= 1) {
                    break;
                }
            }

            if (this.#floors.length > 2) {
                buttons.push({
                    label: this.#floors[2],
                    locked: true,
                    callback: (button) => {
                        // Put floor at i first
                        this.#floors.unshift(this.#floors.splice(2, 1)[0]);

                        this.#stateMachine.setState(MAIN_STATES.LOAD_FLOOR);
                    },
                });
            }

            // buttons.push({
            //     label: "25$ - Buy new floor",
            //     callback: (button) => {
            //         console.log("Buy new floor: ");

            //         new Popup(
            //             this,
            //             box.container.x + button.container.x,
            //             box.container.y + button.container.y,
            //             "- 25 $",
            //             0xeb8932
            //         );
            //     },
            //     autoHide: false,
            // });

            box.addButtons(buttons);


            // buttons.forEach((singleButton, index) => {
            //     console.log(index);
            //     let button = new FloorButton(this, singleButton.label, () => {
            //         singleButton.callback(button);
            //     });

            //     box.addButton(button, singleButton.autoHide);
            // });

            box.setText(this.#floors.length);
            box.show();
        },
    });
    }

    /**
     * @param {Unit} attacker
     * @param {Unit} defender
     * @param {() => void} [callback]
     */
    #attack(attacker, defender, callback) {
        attacker.attack(() => {
            let damage = attacker.atk;

            new Popup(
                this,
                this.#map.container.x + defender.container.x,
                this.#map.container.y + defender.container.y,
                "-" + damage.toString(),
                0xff0000
            );
            defender.takeDamage(damage, callback);
        });
    }

}
