import * as THREE from "three"
import RAF from "../../utils/raf"
import SceneSwitcher from '../../controllers/SceneSwitcher'
// import BlackTrans from "../BlackTrans"
import Scene4 from '../SceneClasses/Scene4'
import PostProcess from '../PostProcess'

class Scene3 {
    constructor() {
        this.bind()
        this.touchPos = new THREE.Vector2()
        this.clickTime = new Date();
		this.finished = false;
		this.sceneId = 3
	}
	
    start({ camera, scene }) {
        this.camera = camera
        this.scene = scene

        RAF.subscribe("scene3", this.update)
        
        this.addEventListeners()
    }

    stop() {
        RAF.unsubscribe("scene3")
    }

    update() {
        this.camera.position.x += 0.04
        this.camera.position.z += 0.005
    }

    onTStart(){
        //touch twice in a second to load next scene
        const newClickTime = new Date();
        console.log(newClickTime)
        if(newClickTime.getSeconds() === this.clickTime.getSeconds()){
            this.endScene();
        }else{
            this.clickTime = newClickTime;
        }
    }

    endScene() {        
        if (this.finished) return
        this.finished = true
        console.log("switching")
        SceneSwitcher.hideScene(this.sceneId)
        // BlackTrans.in()
        PostProcess.fade("in")
        window.removeEventListener('touchstart', this.onTStart)
    }

    loadNextScene() {
        // BlackTrans.out()
        PostProcess.fade("out")
        SceneSwitcher.showScene(this.sceneId+1)
        Scene4.start({camera: this.camera, scene: this.scene})
        this.stop()
    }

    addEventListeners(){
        const onReadyForNextScene = (message) => {
            console.log(JSON.parse(message));
            if(this.finished){
                window.EM.off('readyForNextScene', onReadyForNextScene)
                this.loadNextScene()
            }
        }
        window.addEventListener('touchstart', this.onTStart)
        window.EM.on('readyForNextScene', onReadyForNextScene)
    }

    bind() {
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.update = this.update.bind(this)
        this.loadNextScene = this.loadNextScene.bind(this)
        this.onTStart = this.onTStart.bind(this)

        // window.addEventListener('touchstart', this.onTStart)
        // window.addEventListener('touchend', this.onTEnd)
    }
}

const _instance = new Scene3()
export default _instance

