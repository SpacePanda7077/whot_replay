import { Scene, Math as PhaserMath } from "phaser";
import { Card } from "./Card";
import { GameOrganizer, placement } from "./game_org/game.organizer";
import { Card_Info } from "../repaly.data";
import { CardCounterAndAvatar } from "./Card_Counter_anD_Avatar";

export class Player {
    scene: Scene;
    cards: Card[] = [];
    game_organizer: GameOrganizer;
    placement: placement;
    player_index: number;
    avatar: CardCounterAndAvatar;
    constructor(
        scene: Scene,
        game_organizer: GameOrganizer,
        player_index: number,
        cards: Card_Info[],
        placement: placement,
    ) {
        this.scene = scene;
        this.game_organizer = game_organizer;
        this.player_index = player_index;
        this.placement = placement;
        this.initialize(cards);
        this.avatar = new CardCounterAndAvatar(
            scene,
            placement.x,
            placement.y,
            cards.length,
        );
    }
    initialize(card_info: Card_Info[]) {
        card_info.forEach((cardd, cardIndex) => {
            const card = cardd;
            this.arrange_decks(
                this.player_index,
                card,
                cardIndex,
                this.cards.length,
            );
        });
    }

    arrange_decks(
        playerIndex: number,
        card_info: Card_Info,
        cardIndex: number,
        totalCards: number,
    ) {
        const position = this.placement;
        const { x, y, rot } = this.compute_fan_position(
            playerIndex,
            cardIndex,
            totalCards,
        );

        const card = new Card(
            this.scene,
            card_info.shape,
            card_info.number,
            x,
            y,
            rot,
            playerIndex,
            position.play_rot,
            this,
            this.game_organizer,
        );

        this.cards.push(card);
    }

    add_card_to_hand(playerIndex: number, card: Card) {
        this.cards.push(card);
        this.refresh_hand(playerIndex);
        this.avatar.update_cards_left(this.cards.length);
    }

    refresh_hand(playerIndex: number) {
        this.cards.forEach((card, cardIndex) => {
            const { x, y, rot } = this.compute_fan_position(
                playerIndex,
                cardIndex,
                this.cards.length,
            );
            card.move_to(x, y, rot, playerIndex);
        });
    }

    compute_fan_position(
        playerIndex: number,
        cardIndex: number,
        totalCards: number,
    ) {
        const position = this.placement;

        const spread = 50;
        const radius = 80;

        const start = -spread / 2;
        const step = totalCards > 1 ? spread / (totalCards - 1) : 0;
        const offset = start + step * cardIndex;
        const angle = PhaserMath.DegToRad(offset);

        let x = position.x;
        let y = position.y;
        const rot = position.rot;

        return { x, y, rot };
    }
}

