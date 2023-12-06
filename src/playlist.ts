
import * as THREE from 'three';
// GUI
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

export interface PlaylistCallback {
    video: THREE.VideoTexture;
}

export class Playlist {

    public video: THREE.VideoTexture;

    private _playlist: string[] = [
        'Seth Hills - Light.mp4',
        'ZOOTAH - Cupcakes.mp4',
    ];

    constructor(callback: (data: PlaylistCallback) => void) {

        const that = this;

        const gui = new GUI();

        const playlist = gui.addFolder('Playlist');

        playlist.add(this, '_playlist', this._playlist).onChange(function (value) {
            that._loadVideo(value);
            callback({video: that.video});
        });

    }

    private _loadVideo(video: string) {

        this.video = new THREE.VideoTexture( document.createElement( 'video' ) );
        this.video.crossOrigin = 'anonymous';

        const videoElement = document.createElement( 'video' );
        videoElement.src = require('./assets/music/' + video);
        videoElement.loop = true;
        videoElement.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        videoElement.play();

        this.video.image = videoElement;

    }

}

