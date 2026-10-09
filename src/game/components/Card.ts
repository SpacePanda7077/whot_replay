import { Scene, Math as PhaserMath } from "phaser";
import { GameOrganizer } from "./game_org/game.organizer";
import { Player } from "./Player";

const special_cards = [1, 2, 8, 14];

export class Card {
    scene: Scene;
    shape: string;
    number: number;
    card: Phaser.GameObjects.Container;
    card_base: Phaser.GameObjects.Sprite;
    card_shape: Phaser.GameObjects.Sprite;
    rot: number;
    card_logo: Phaser.GameObjects.Sprite;
    card_number_right: Phaser.GameObjects.Text;
    card_number_left: Phaser.GameObjects.Text;
    pos_id: number;
    play_rot: number;
    owner: Player | null;
    game_organizer: GameOrganizer;

    // Track running tweens so a new animation can cancel the old one.
    move_tween?: Phaser.Tweens.Tween;
    reveal_chain?: Phaser.Tweens.TweenChain;

    constructor(
        scene: Scene,
        shape: string,
        number: number,
        x: number,
        y: number,
        rot: number,
        pos_id: number,
        play_rot: number,
        owner: Player | null,
        game_organizer: GameOrganizer,
    ) {
        this.scene = scene;
        this.shape = shape;
        this.number = number;
        this.rot = rot;
        this.pos_id = pos_id;
        this.play_rot = play_rot;
        this.create_card(x, y);
        this.owner = owner;
        this.game_organizer = game_organizer;
    }

    create_card(x: number, y: number) {
        this.card = this.scene.add.container(x, y).setAngle(this.rot);
        this.card_base = this.scene.add
            .sprite(0, 0, "card-base")
            .setTint(0x681f3d);
        this.card_logo = this.scene.add
            .sprite(0, 0, "logo")
            .setDisplaySize(64, 64)
            .setVisible(true);

        this.card_shape = this.scene.add
            .sprite(0, 0, this.shape)
            .setDisplaySize(64, 64)
            .setVisible(false);

        this.card_number_right = this.scene.add
            .text(35, -65, this.number.toString(), {
                fontSize: "24px",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setVisible(false)
            .setOrigin(0.5)
            .setTint(0x681f3d);
        this.card_number_left = this.scene.add
            .text(-35, 65, this.number.toString(), {
                fontSize: "24px",
                fontStyle: "bold",
                fontFamily: "Arial",
            })
            .setVisible(false)
            .setOrigin(0.5)
            .setTint(0x681f3d);

        if (this.shape !== "whot") this.card_shape.setTint(0x873b61);

        this.card.add([
            this.card_base,
            this.card_logo,
            this.card_shape,
            this.card_number_right,
            this.card_number_left,
        ]);
    }

    private stop_tweens() {
        this.move_tween?.stop();
        this.move_tween = undefined;
        this.reveal_chain?.stop();
        this.reveal_chain = undefined;
    }

    private show_face(shape: string, number: number) {
        this.card_base.clearTint();
        this.card_shape.setVisible(true);
        this.card_number_right.setVisible(true).setText(number.toString());
        this.card_number_left.setVisible(true).setText(number.toString());
        this.card_logo.setVisible(false);
        this.card_shape.setTexture(shape);
    }

    private finish_reveal(pos_id: number) {
        this.drop(pos_id);
        this.owner?.avatar.update_cards_left(this.owner.cards.length);
    }

    reveal(z: number, pos_id: number, shape: string, number: number) {
        // Cancel any in-flight move so it can't override this card's position.
        this.stop_tweens();

        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const posX = PhaserMath.Between(width / 2 - 20, width / 2 + 20);
        const posY = PhaserMath.Between(height / 2 - 20, height / 2 + 20);
        const isSpecialCard = special_cards.includes(this.number);

        // Catch-up mode: jump straight to the final state, no animation.
        if (this.game_organizer.instant) {
            this.card.setDepth(z);
            this.show_face(shape, number);
            this.card.setPosition(posX, posY).setScale(1);
            this.finish_reveal(pos_id);
            return;
        }

        this.reveal_chain = this.scene.tweens.chain({
            targets: this.card,
            onStart: () => {
                this.card.setDepth(z);
            },
            tweens: [
                {
                    y: posY,
                    x: posX,
                    duration: isSpecialCard ? 400 : 250,
                    ease: "Expo.easeOut",
                    onStart: () => {
                        this.show_face(shape, number);
                    },
                },
                {
                    scaleX: 1,
                    scaleY: 1,
                    y: posY,
                    x: posX,
                    duration: 100,
                    ease: "Back.easeOut",
                    onComplete: () => {
                        this.finish_reveal(pos_id);
                    },
                },
            ],
        });
    }

    take_market(z: number, playerIndex: number) {
        this.game_organizer.players[playerIndex].add_card_to_hand(
            playerIndex,
            this,
        );
        if (!this.game_organizer.instant) {
            this.scene.sound.play("card_play");
        }
    }

    move_to(x: number, y: number, rot: number, playerIndex: number) {
        this.stop_tweens();

        // Set the owner immediately, not in onComplete, so a PLAY_CARD that
        // follows right away sees the correct owner.
        this.owner = this.game_organizer.players[playerIndex];

        if (this.game_organizer.instant) {
            this.card.setPosition(x, y).setAngle(rot);
            return;
        }

        this.move_tween = this.scene.tweens.add({
            targets: this.card,
            x,
            y,
            angle: rot,
            duration: 400,
            ease: "Back.easeOut",
            onComplete: () => {
                this.move_tween = undefined;
            },
        });
    }

    make_mine() {
        this.pos_id = 2;
    }

    drop(player_index: number) {
        if (this.owner && this.owner.cards) {
            const index = this.owner.cards.findIndex((card) => card === this);
            if (index !== -1) {
                this.owner.cards[index].pos_id = -2;
                this.owner.cards.splice(index, 1);
            }
        }
    }

    normalizeAngle(offset: number, baseAngle: number): number {
        return baseAngle + offset;
    }
}
