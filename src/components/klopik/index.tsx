import { useCallback, useEffect, useRef, useState, type FC } from "react";


import "./styles.scss";

const Klopik: FC = () => {
    const [isMouseHovered, setIsMouseHovered] = useState(false);
    const [top, setTop] = useState(4.5);

    const onMouseEnter = useCallback(() => setIsMouseHovered(true), []);
    const onMouseLeave = useCallback(() => setIsMouseHovered(false), []);

    useSmoothHoverMoveUpDown(-0.2, 4.5, isMouseHovered, top, setTop);

    return (
        <div
            className="klopik-container"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                transform: `translateY(${top}rem)`,
            }}
            title="Почеши меня около ушка!"
        >
            <img src="./img/klopik.png" />
        </div>
    );
};

export default Klopik;

/**
 * Move element top when active flag is set, otherwise - move element to bottom
 * @param active Is element should move top. If `false` - element will move bottom
 * @param top Current top position
 * @param setTop Top value updated
 */
const useSmoothHoverMoveUpDown = (
    minValue: number,
    maxValue: number,
    active: boolean,
    top: number,
    setTop: (updater: (prev: number) => number) => void
): void => {
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const step = () => {
            setTop(prev => {
                let next = prev;

                if (active && prev > minValue) {
                    next = Math.max(prev - 0.002, minValue); // вверх — медленно
                } else if (!active && prev < maxValue) {
                    next = Math.min(prev + 0.0025, maxValue); // вниз — быстрее
                }

                // Запланировать следующий кадр, если нужно продолжать движение
                if (
                    (active && next > minValue) ||
                    (!active && next < maxValue)
                ) {
                    animationRef.current = requestAnimationFrame(step);
                } else {
                    animationRef.current = null;
                }

                return next;
            });
        };

        // Запуск
        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(step);
        }

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [active, maxValue, minValue, setTop, top]);
}
