export const scrollDown = (container: HTMLDivElement | null) => {
    container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
    });
};

export const checkIfBottomReached = (container: HTMLDivElement | null) => {
    if (!container) return true;
    return (
        Math.abs(
            container.scrollHeight -
                container.clientHeight -
                container.scrollTop
        ) <= 10
    );
};

export const updateBottomReachedHandler = (
    container: HTMLDivElement | null,
    setIsBottomReached: (value: boolean) => void
) => {
    return () => {
        if (!container) return;
        const isBottom = checkIfBottomReached(container);
        setIsBottomReached(isBottom);
    };
};
