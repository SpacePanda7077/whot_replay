import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);
    const container = useRef<HTMLDivElement | null>(null);

    // Scale.FIT re-measures its parent only on window resize, but the
    // container also changes size with the layout (breakpoints, rotating a
    // phone, the page reflowing after load). Re-fit whenever it resizes.
    useEffect(() =>
    {
        const el = container.current;
        if (!el || typeof ResizeObserver === 'undefined') return;

        let frame = 0;
        const observer = new ResizeObserver(() =>
        {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => game.current?.scale.refresh());
        });
        observer.observe(el);

        return () =>
        {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, []);

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("game-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container" ref={container} className="h-full w-full"></div>
    );

});
