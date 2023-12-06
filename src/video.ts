
import * as THREE from 'three';

export class Video {


    public sound: THREE.Audio;
    public listener: THREE.AudioListener;
    public analyser: THREE.AudioAnalyser;
    public video: THREE.VideoTexture;
    private _plane: THREE.Mesh;

    public initialized: boolean = false;

    private readonly _options: any = {
        loop: false,
        autoplay: false,
        enableKeyboardControls: true,
        windTimeConstant: 0.1,
        fftSize: 2048
    }

    constructor(video: THREE.VideoTexture, scene: THREE.Scene, options?: any) {

        const that = this;
        this.video = video;
        this._options = { ...this._options, ...options };

        this.listener = new THREE.AudioListener();
        this.sound = new THREE.Audio( this.listener );
        this.sound.setMediaElementSource(video.source.data);
        this.analyser = new THREE.AudioAnalyser( this.sound, this._options.fftSize );


        const geometry = new THREE.PlaneGeometry( 16, 9, 32 );
        const material = new THREE.MeshBasicMaterial( {
            map: this.video,
            side: THREE.DoubleSide,
        } );
        this._plane = new THREE.Mesh( geometry, material );
        this._plane.scale.set(0.5, 0.5, 0.5);

        scene.add( this._plane );

        // if (this._options.enableKeyboardControls) {
        //     window.addEventListener('keydown', this._onKeyDown.bind(this));
        //     window.addEventListener('keyup', this._onKeyUp.bind(this));
        // }

        this.video.source.data.play();

        that.initialized = true;

    }


    private _onKeyDown(event: KeyboardEvent): void {

        if (!this.sound) return;

        if (event.key === ' ') {
            if (this.sound.isPlaying) {
                this.sound.pause();
            }
            else {
                this.sound.play();
            }
        }

        if (event.key === 'ArrowRight') {
            this.sound.setPlaybackRate(this.sound.playbackRate + this._options.windTimeConstant);
        }

        if (event.key === 'ArrowLeft') {
            this.sound.setPlaybackRate(this.sound.playbackRate - this._options.windTimeConstant);
        }

        if (event.key === 'ArrowUp' && this.sound.getVolume() < 0.9) {
            this.sound.setVolume(this.sound.getVolume() + 0.1);
        }

        if (event.key === 'ArrowDown' && this.sound.getVolume() > 0.1) {
            this.sound.setVolume(this.sound.getVolume() - 0.1);
        }

    }


    private _onKeyUp(event: KeyboardEvent): void {

        if (!this.sound) return;

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            this.sound.setPlaybackRate(1);
        }
    };


    public dispose() {

        if (this.sound) {
            this.video.source.data.pause();
            this.sound.disconnect();
            this.sound.buffer = null;
            this.sound = null;
        }

        if (this.listener) {
            this.listener = null;
        }

        if (this.analyser) {
            this.analyser.analyser.disconnect();
            this.analyser.analyser = null;
            this.analyser = null;
        }

        if (this._options.enableKeyboardControls) {
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
        }

    }

}
