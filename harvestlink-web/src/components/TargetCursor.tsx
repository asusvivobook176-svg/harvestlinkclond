import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

export interface TargetCursorProps {
    targetSelector?: string;
    spinDuration?: number;
    hideDefaultCursor?: boolean;
    hoverDuration?: number;
    parallaxOn?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
    targetSelector = '.cursor-target',
    spinDuration = 2,
    hideDefaultCursor = true,
    hoverDuration = 0.3,
    parallaxOn = true
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
    const spinTl = useRef<gsap.core.Timeline | null>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    const isActiveRef = useRef(false);
    const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
    const tickerFnRef = useRef<(() => void) | null>(null);
    const activeStrengthRef = useRef({ current: 0 });
    const currentTargetRef = useRef<HTMLElement | null>(null);

    const isMobile = useMemo(() => {
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUserAgent = mobileRegex.test((userAgent || '').toLowerCase());
        return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
    }, []);

    const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12, padding: 4 }), []);

    const moveCursor = useCallback((x: number, y: number) => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
    }, []);

    useEffect(() => {
        if (isMobile || !cursorRef.current) return;

        const originalCursor = document.body.style.cursor;
        if (hideDefaultCursor) {
            document.body.style.cursor = 'none';
        }

        const cursor = cursorRef.current;
        cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

        let activeTarget: HTMLElement | null = null;
        let currentLeaveHandler: (() => void) | null = null;
        let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

        const cleanupTarget = (target: Element) => {
            if (currentLeaveHandler) {
                target.removeEventListener('mouseleave', currentLeaveHandler);
            }
            currentLeaveHandler = null;
        };

        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });

        const createSpinTimeline = () => {
            if (spinTl.current) {
                spinTl.current.kill();
            }
            spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
        };

        createSpinTimeline();

        const tickerFn = () => {
            if (!cursorRef.current || !cornersRef.current || !dotRef.current) {
                return;
            }

            const strength = activeStrengthRef.current.current;
            const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
            const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

            // Update Target Positions dynamically to stay pinned during scroll/animation
            if (currentTargetRef.current && strength > 0) {
                const rect = currentTargetRef.current.getBoundingClientRect();
                const { borderWidth, cornerSize, padding } = constants;
                targetCornerPositionsRef.current = [
                    { x: rect.left - borderWidth - padding, y: rect.top - borderWidth - padding },
                    { x: rect.right + borderWidth + padding - cornerSize, y: rect.top - borderWidth - padding },
                    { x: rect.right + borderWidth + padding - cornerSize, y: rect.bottom + borderWidth + padding - cornerSize },
                    { x: rect.left - borderWidth - padding, y: rect.bottom + borderWidth + padding - cornerSize }
                ];
            }

            // Handle Snapping Corners
            if (targetCornerPositionsRef.current && strength > 0) {
                const corners = Array.from(cornersRef.current);
                corners.forEach((corner, i) => {
                    const currentX = gsap.getProperty(corner, 'x') as number;
                    const currentY = gsap.getProperty(corner, 'y') as number;
                    const targetX = targetCornerPositionsRef.current![i].x - cursorX;
                    const targetY = targetCornerPositionsRef.current![i].y - cursorY;

                    // Smooth interpolation happens via 'strength' being tweened from 0 to 1
                    // For pinning during scroll, we need immediate updates (duration 0 or very small)
                    const finalX = currentX + (targetX - currentX) * Math.min(1, strength * 1.5);
                    const finalY = currentY + (targetY - currentY) * Math.min(1, strength * 1.5);

                    gsap.set(corner, { x: finalX, y: finalY });
                });

                // Magnetic Pull for the central dot
                if (currentTargetRef.current) {
                    const rect = currentTargetRef.current.getBoundingClientRect();
                    const targetCenterX = rect.left + rect.width / 2;
                    const targetCenterY = rect.top + rect.height / 2;

                    const pullX = (targetCenterX - cursorX) * 0.4 * strength;
                    const pullY = (targetCenterY - cursorY) * 0.4 * strength;

                    gsap.set(dotRef.current, { x: pullX, y: pullY });
                }
            } else {
                // Return to center when not over a target
                const currentDotX = gsap.getProperty(dotRef.current, 'x') as number;
                const currentDotY = gsap.getProperty(dotRef.current, 'y') as number;
                gsap.set(dotRef.current, {
                    x: currentDotX * 0.8,
                    y: currentDotY * 0.8
                });
            }
        };

        tickerFnRef.current = tickerFn;

        const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
        window.addEventListener('mousemove', moveHandler);

        const scrollHandler = () => {
            if (!activeTarget || !cursorRef.current) return;
            const mouseX = gsap.getProperty(cursorRef.current, 'x') as number;
            const mouseY = gsap.getProperty(cursorRef.current, 'y') as number;
            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
            const isStillOverTarget =
                elementUnderMouse &&
                (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
            if (!isStillOverTarget) {
                currentLeaveHandler?.();
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });

        const mouseDownHandler = () => {
            if (!dotRef.current) return;
            gsap.to(dotRef.current, { scale: 0.6, duration: 0.3, ease: 'back.out(2)' });
            gsap.to(cursorRef.current, { scale: 0.85, duration: 0.2 });
        };

        const mouseUpHandler = () => {
            if (!dotRef.current) return;
            gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
        };

        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);

        const enterHandler = (e: MouseEvent) => {
            const directTarget = e.target as Element;
            const allTargets: HTMLElement[] = [];
            let current: Element | null = directTarget;
            while (current && current !== document.body) {
                if (current.matches(targetSelector)) {
                    allTargets.push(current as HTMLElement);
                }
                current = current.parentElement;
            }
            const target = allTargets[0] || null;
            if (!target || !cursorRef.current || !cornersRef.current) return;
            if (activeTarget === target) return;
            if (activeTarget) {
                cleanupTarget(activeTarget);
            }
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }

            activeTarget = target;
            currentTargetRef.current = target;
            const corners = Array.from(cornersRef.current);
            corners.forEach(corner => gsap.killTweensOf(corner));
            gsap.killTweensOf(cursorRef.current, 'rotation');
            spinTl.current?.pause();
            gsap.to(cursorRef.current, { rotation: 0, scale: 1.1, duration: 0.3 });

            // Apply Target Color
            const targetColor = target.dataset.cursorColor || 'black';
            gsap.to([dotRef.current, ...corners], {
                borderColor: targetColor,
                backgroundColor: (_: number, el: HTMLElement | SVGElement) => el === dotRef.current ? targetColor : 'transparent',
                duration: 0.3
            });

            // Initial position calculation
            const rect = target.getBoundingClientRect();
            const { borderWidth, cornerSize, padding } = constants;
            targetCornerPositionsRef.current = [
                { x: rect.left - borderWidth - padding, y: rect.top - borderWidth - padding },
                { x: rect.right + borderWidth + padding - cornerSize, y: rect.top - borderWidth - padding },
                { x: rect.right + borderWidth + padding - cornerSize, y: rect.bottom + borderWidth + padding - cornerSize },
                { x: rect.left - borderWidth - padding, y: rect.bottom + borderWidth + padding - cornerSize }
            ];

            isActiveRef.current = true;
            gsap.ticker.add(tickerFnRef.current!);
            gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

            const leaveHandler = () => {
                gsap.ticker.remove(tickerFnRef.current!);
                isActiveRef.current = false;
                targetCornerPositionsRef.current = null;
                currentTargetRef.current = null;
                gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
                activeTarget = null;

                if (cornersRef.current) {
                    const corners = Array.from(cornersRef.current);
                    gsap.killTweensOf(corners);
                    gsap.to(corners, { borderColor: 'black', duration: 0.3 });
                    gsap.to(dotRef.current, { backgroundColor: 'black', borderColor: 'black', duration: 0.3 });
                    gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });

                    const { cornerSize: cs } = constants;
                    const positions = [
                        { x: -cs * 1.5, y: -cs * 1.5 },
                        { x: cs * 0.5, y: -cs * 1.5 },
                        { x: cs * 0.5, y: cs * 0.5 },
                        { x: -cs * 1.5, y: cs * 0.5 }
                    ];

                    corners.forEach((corner, index) => {
                        gsap.to(corner, {
                            x: positions[index].x,
                            y: positions[index].y,
                            duration: 0.4,
                            ease: 'back.out(1.7)'
                        });
                    });
                }

                resumeTimeout = setTimeout(() => {
                    if (!activeTarget && cursorRef.current && spinTl.current) {
                        const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
                        const normalizedRotation = currentRotation % 360;
                        spinTl.current.kill();
                        spinTl.current = gsap
                            .timeline({ repeat: -1 })
                            .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
                        gsap.to(cursorRef.current, {
                            rotation: normalizedRotation + 360,
                            duration: spinDuration * (1 - normalizedRotation / 360),
                            ease: 'none',
                            onComplete: () => {
                                spinTl.current?.restart();
                            }
                        });
                    }
                    resumeTimeout = null;
                }, 50);
                cleanupTarget(target);
            };
            currentLeaveHandler = leaveHandler;
            target.addEventListener('mouseleave', leaveHandler);
        };

        window.addEventListener('mouseover', enterHandler as EventListener);

        return () => {
            if (tickerFnRef.current) {
                gsap.ticker.remove(tickerFnRef.current);
            }
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseover', enterHandler as EventListener);
            window.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            if (activeTarget) {
                cleanupTarget(activeTarget);
            }
            spinTl.current?.kill();
            document.body.style.cursor = originalCursor;
            isActiveRef.current = false;
            targetCornerPositionsRef.current = null;
            activeStrengthRef.current.current = 0;
        };
    }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

    useEffect(() => {
        if (isMobile || !cursorRef.current || !spinTl.current) return;
        if (spinTl.current.isActive()) {
            spinTl.current.kill();
            spinTl.current = gsap
                .timeline({ repeat: -1 })
                .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
        }
    }, [spinDuration, isMobile]);

    if (isMobile) {
        return null;
    }

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-9999"
            style={{ willChange: 'transform' }}
        >
            <div
                ref={dotRef}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ willChange: 'transform, background-color' }}
            />
            <div
                className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-black -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
                style={{ willChange: 'transform, border-color' }}
            />
            <div
                className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-black translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
                style={{ willChange: 'transform, border-color' }}
            />
            <div
                className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-black translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
                style={{ willChange: 'transform, border-color' }}
            />
            <div
                className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-black -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
                style={{ willChange: 'transform, border-color' }}
            />
        </div>
    );
};

export default TargetCursor;
