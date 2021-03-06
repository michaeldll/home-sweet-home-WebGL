import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import LoadingController from "../controllers/LoadingController"
import Scenes from "../controllers/ScenesManager"
import * as THREE from 'three'

import SceneShader from './SceneShader'
import scenes from '../controllers/ScenesManager'


class SceneLoader {
    constructor() {
        this.bind()
        this.loader = new GLTFLoader(LoadingController.manager)
    }


    start() {
        Scenes.forEach(scene => {
            this.loader.load(scene.url, (gltf) => {
                gltf.scene.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        if (child.material.map != undefined && child.material.map != null) {
                            let sceneShader = new SceneShader(child.material.map)
                            child._shader = sceneShader
                            child.material = sceneShader.shader
                        }
                    }
                })
                scene.scene = gltf.scene
                if (scene.scale)
                    scene.scene.scale.set(scene.scale, scene.scale, scene.scale)
            })
        });
    }

    show(sceneID) {
        this.currentCam = this.cameras[0]
        this.scene.add(this.scenes[sceneID])
    }

    hide(sceneID) {
        this.scene.remove(this.scenes[sceneID])
    }

    bind() {
        this.start = this.start.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }
}

const _instance = new SceneLoader()

export default _instance