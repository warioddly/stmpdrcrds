
import * as THREE from 'three';
import {PCDLoader} from 'three/examples/jsm/loaders/PCDLoader';
import Noise3D from "./noise";
import Utils from "./utils";

export class Logo {


    public mesh: THREE.Mesh;
    private _noise3D: Noise3D = new Noise3D();
    private _utils: any = new Utils();


    private readonly _options: any = {
        radius: 25,
        color: 0x00ff00,
        amplitude: 15,
        roughness: 0.00001,
        position: { x: 0, y: 0, z: 0 },
        rotateAnimation: true,
        rotateAmplitude: 0.001,
    }


    constructor(scene: THREE.Scene) {

        const that = this;

        new PCDLoader().load( require('./assets/objects/logo.pcd'), function (object) {

            that.mesh = object;

            scene.add(that.mesh);

        } );

    }



    public animate (dataArray: Uint8Array, time?: number ) {


        const lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1),
            upperHalfArray = dataArray.slice((dataArray.length / 2 ) - 1, dataArray.length - 1),
            lowerMaxFr = this._utils.max(lowerHalfArray) / lowerHalfArray.length,
            upperAvgFr = this._utils.avg(upperHalfArray) / upperHalfArray.length;


        this._transform(
            this._utils.modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
            this._utils.modulate(upperAvgFr, 0, 1, 0, 4),
            time,
        );

        this.mesh.material.color.setHSL(
            0.1 + (0.8 * (lowerMaxFr + upperAvgFr)),
            0.5,
            0.5,
        );


        if (this._options.rotateAnimation) {
            const amplitude = this._options.rotateAmplitude;
            this.mesh.rotation.x += amplitude;
            this.mesh.rotation.y += amplitude;
            this.mesh.rotation.z += amplitude;
        }

    }



    private _transform( bassFr: number, treFr: number, time?: number,) {


        const vertex = new THREE.Vector3();
        const { amplitude, roughness, radius }: any = this._options;
        const position = this.mesh.geometry.attributes.position;
        const _time = time ?? window.performance.now();


        for(let i = 0; i < position.count; i++){

            vertex.fromBufferAttribute(position, i);
            vertex.normalize();

            const distance = (radius + bassFr ) + this._noise3D.noise(
                vertex.x + _time * roughness * 7,
                vertex.y + _time * roughness * 8,
                vertex.z + _time * roughness * 9
            ) * amplitude * treFr;

            vertex.multiplyScalar(distance);
            position.setXYZ(i, vertex.x, vertex.y, vertex.z);

        }

        this.mesh.geometry.attributes.position.needsUpdate = true;

    }



}

