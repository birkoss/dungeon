import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Map, MAP_FLOOR } from "../map/map.js";
import { Data } from "../utils/data.js";
import { StateMachine } from "../state-machine.js";
import { Unit, UNIT_AI } from "../entity/unit.js";
import { Button } from "../ui/button.js";
import { Popup } from "../ui/popup.js";

const MAIN_STATES = Object.freeze({
    CREATE_DUNGEON: 'CREATE_DUNGEON',
    CREATE_PARTY: 'CREATE_PARTY',
    CREATE_MAP: 'CREATE_MAP',
    TURN_START: 'TURN_START',
    SELECT_UNIT: 'SELECT_UNIT',
    UNIT_DONE: 'UNIT_DONE',
    TURN_END: 'TURN_END',
});

export class DungeonScene extends Phaser.Scene {
    /** @type {Map} */
    #map;
    /** @type {StateMachine} */
    #stateMachine;

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


        /*

        let button = new Button(this, "Attack", () => {
            this.add.tween({
                targets: button.container,
                y: this.scale.height + 60,
                duration: 200,
            });
            player.attack();
            this.time.delayedCall(400, () => {
                enemy.takeDamage(10);
                player.idle();

                this.time.delayedCall(400, () => {
                    enemy.attack();

                    this.time.delayedCall(400, () => {
                        player.takeDamage(10);
                        enemy.idle();

                        this.add.tween({
                            targets: button.container,
                            y: this.#map.container.y + this.#map.container.getBounds().height + 40,
                            duration: 200,
                        });
                    });
                });
            });
            
        });

        button.container.x = this.game.canvas.width/2;
        button.container.y = this.#map.container.y + this.#map.container.getBounds().height + 40;
        */
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
                    'enemy',
                    'enemy',
                    'enemy',
                    'enemy',
                    'enemy',
                    'boss',
                    'empty',
                    'tavern',
                    'chest',
                ];

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

                this.#map.loadFloor(MAP_FLOOR.ENEMY, {
                    party: this.#party,
                });

                this.#stateMachine.setState(MAIN_STATES.TURN_START);
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

                this.#map.selectUnit(unit);

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

                let originalY = this.#map.container.y + this.#map.container.getBounds().height + 40;
               
                let button = new Button(this, "Attack", () => {
                    this.#map.clearSelections();

                    this.add.tween({
                        targets: button.container,
                        y: this.scale.height + 60,
                        duration: 200,
                    });

                    this.#attack(unit, enemy, () => {
                        this.#stateMachine.setState(MAIN_STATES.UNIT_DONE);
                    });
                    
                });

                button.container.x = this.game.canvas.width/2;
                button.container.y = this.game.canvas.height + 60;

                this.add.tween({
                    targets: button.container,
                    y: originalY,
                    duration: 200,
                });
            },
        });

        // UNIT_DONE
        this.#stateMachine.addState({
            name: MAIN_STATES.UNIT_DONE,
            onEnter: () => {
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
    }

    /**
     * @param {Unit} attacker
     * @param {Unit} defender
     * @param {() => void} [callback]
     */
    #attack(attacker, defender, callback) {
        attacker.attack(() => {
            let damage = 1;

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
