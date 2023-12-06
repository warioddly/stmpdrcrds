
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {Logo} from "./logo";
import {Playlist} from "./playlist";

class Engine {


    private readonly _scene: THREE.Scene;
    private readonly _camera: THREE.PerspectiveCamera;
    private readonly _renderer: THREE.WebGLRenderer;
    private _controls: OrbitControls;
    private _logo: Logo;
    private _playlist: Playlist;

    constructor() {

        this._scene = new THREE.Scene();
        this._scene.fog = new THREE.Fog( this._scene.background, 3500, 15000 );
        this._scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.01, THREE.SRGBColorSpace );

        this._camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1.01, 1000 );
        this._camera.position.z = 100;

        this._renderer = new THREE.WebGLRenderer( { antialias: true, } );
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );


        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
        this._controls.minDistance = 20;
        this._controls.maxDistance = 120;

        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.1 );
        this._scene.add( ambientLight );

        this._logo = new Logo(this._scene);

        this._playlist = new Playlist((video: THREE.VideoTexture) => {
            console.log(video);
        });

        document.body.appendChild( this._renderer.domElement );

        window.addEventListener( 'resize', this._resize.bind(this) );

        this._renderer.setAnimationLoop( this._animate.bind(this) );

    }


    private _animate( time: number ) {

        this._controls.update();

        this._renderer.render( this._scene, this._camera );

    }


    private _resize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize( window.innerWidth, window.innerHeight );
    }


}



new Engine();
