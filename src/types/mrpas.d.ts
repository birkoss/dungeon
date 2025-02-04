declare type IsTransparentFunc = (x: number, y: number) => boolean;
declare type IsVisibleFunc = (x: number, y: number) => boolean;
declare type SetVisibleFunc = (x: number, y: number) => void;
declare class Mrpas {
     mapWidth;
     mapHeight;
     readonly isTransparent;
    constructor(mapWidth: number, mapHeight: number, isTransparent: IsTransparentFunc);
     computeOctantY;
     computeOctantX;
    setMapDimensions(mapWidth: number, mapHeight: number): void;
    compute(originX: number, originY: number, radius: number, isVisible: IsVisibleFunc, setVisible: SetVisibleFunc): void;
}