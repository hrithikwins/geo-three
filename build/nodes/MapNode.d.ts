import { Material, Mesh, Vector3, BufferGeometry, Object3D } from 'three';
import { MapView } from '../MapView';
export declare class QuadTreePosition {
    static root: number;
    static topLeft: number;
    static topRight: number;
    static bottomLeft: number;
    static bottomRight: number;
}
export declare abstract class MapNode extends Mesh {
    mapView: MapView;
    parentNode: MapNode;
    location: number;
    level: number;
    x: number;
    y: number;
    nodesLoaded: number;
    subdivided: boolean;
    childrenCache: Object3D[];
    cacheTiles: boolean;
    isMesh: boolean;
    static baseGeometry: BufferGeometry;
    static baseScale: Vector3;
    static childrens: number;
    constructor(parentNode?: MapNode, mapView?: MapView, location?: number, level?: number, x?: number, y?: number, geometry?: BufferGeometry, material?: Material);
    initialize(): Promise<void>;
    createChildNodes(): void;
    subdivide(): void;
    simplify(): void;
    loadData(): Promise<void>;
    nodeReady(): void;
}
