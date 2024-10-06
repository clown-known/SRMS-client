export const calculateTime = (distance: number): number => {
    const speed = 40;
    const hour = distance / speed;
    return hour;
};
