
import * as THREE from 'three';
// GUI
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';


export class Playlist {

    public video: THREE.VideoTexture;

    private _playlist: string[] = [
        'Seth Hills - Light.mp4',
        'ZOOTAH - Cupcakes.mp4',
    ];

    constructor(callback: (data: THREE.VideoTexture) => void) {

        const that = this;

        const gui = new GUI();

        const playlist = gui.addFolder('Playlist');

        playlist.add(this, '_playlist', this._playlist).onChange(function (value: string) {
            that._loadVideo(value);
            callback(that.video);
        });

    }

    private _loadVideo(video: string) {

        const videoElement = document.createElement( 'video' );
        videoElement.src = require('./assets/music/' + video);
        videoElement.loop = true;
        videoElement.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        // create playback
        // videoElement.play();

        this.video = new THREE.VideoTexture( videoElement );

    }

}

